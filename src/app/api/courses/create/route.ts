import db from "@/db";
import { eq, and } from "drizzle-orm";
import { type Course, CourseParticipant, Courses } from "@/db/schema/course";
import { rooms } from "@/db/schema/room";
import { participants } from "@/db/schema/participants";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";
import { uploadToS3 } from "@/lib/s3";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { validateImage } from "@/lib/fileUploads";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        //Only admins and staff can create courses
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }

        const formData = await req.formData();
        console.log(formData);
        const courseName = formData.get("courseName") as string;
        const courseRoom = formData.get("courseRoom") as string;
        const courseDescription = formData.get("courseDescription") as string;
        const courseStartDate = new Date(
            formData.get("courseStartDate") as string
        );
        const courseEndDate = new Date(formData.get("courseEndDate") as string);
        const courseLanguage = formData.get("courseLanguage") as string;
        const courseStatus = formData.get("courseStatus") as string;
        const courseType = formData.get("courseType") as string;
        const courseParticipants = formData.get("courseParticipants") as string;

        const courseImage = formData.get("courseImage") as File | null;
        if (
            !courseName ||
            !courseDescription ||
            !courseStartDate ||
            !courseEndDate
        ) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        if (courseName.length > 255 || courseDescription.length > 255) {
            return new Response(
                JSON.stringify({
                    error: "Course Name/Description character limit exceeded",
                }),
                { status: 400 }
            );
        }
        const startDate = new Date(courseStartDate);
        const endDate = new Date(courseEndDate);
        if (endDate <= startDate) {
            return new Response(
                JSON.stringify({
                    error: "End date must be after the start date",
                }),
                { status: 400 }
            );
        }
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return new Response(
                JSON.stringify({
                    error: "Invalid date format",
                }),
                { status: 400 }
            );
        }

        const roomId = parseInt(courseRoom);
        if (!roomId || roomId === -1) {
            return new Response(
                JSON.stringify({
                    error: "Missing Room Id",
                }),
                { status: 400 }
            );
        }

        //Validate Room Exists
        const room = await db.select().from(rooms).where(eq(rooms.id, roomId));
        if (!room) {
            return new Response(
                JSON.stringify({
                    error: "Invalid Room Id",
                }),
                { status: 400 }
            );
        }
        let uploadId: number | null = null;
        if (courseImage) {
            const validationError = validateImage(courseImage);
            if (validationError) {
                return new Response(
                    JSON.stringify({
                        validationError,
                    }),
                    { status: 400 }
                );
            }
            const { success, fileName } = await uploadToS3(courseImage);
            if (!success) {
                throw new Error("Failed to upload to S3.");
            }
            if (fileName) {
                uploadId = await db
                    .insert(uploadMedia)
                    .values({
                        fileName: courseImage.name,
                        fileType: courseImage.type,
                        fileSize: courseImage.size,
                        fileKey: fileName,
                        mediaOrigin: "course",
                        ownerId: parseInt(session!.user.id),
                    })
                    .$returningId()
                    .then((res) => res[0].id);
            }
        }
        const insertData: Omit<Course, "id"> = {
            title: courseName,
            description: courseDescription,
            start: startDate,
            end: endDate,
            lang: courseLanguage,
            status: courseStatus,
            kind: courseType,
            uploadId: uploadId,
            roomId,
        };
        const courseId = await db
            .insert(Courses)
            .values(insertData)
            .$returningId()
            .then((res) => res[0].id);

        if (!courseId) {
            return new Response(
                JSON.stringify({
                    error: "Error creating course",
                }),
                { status: 500 }
            );
        }

        const unaddedParticipants: string[] = [];
        if (courseParticipants) {
            const participantsArr = courseParticipants.split(",");

            await Promise.all(
                participantsArr.map(async (participant: string) => {
                    const nameParts = participant.trim().split(" ");
                    const firstName = nameParts[0] || "";
                    const lastName = nameParts.slice(1).join(" ") || "";

                    if (!firstName || !lastName) {
                        unaddedParticipants.push(participant.trim());
                        return;
                    }

                    const existingUser = await db
                        .select()
                        .from(participants)
                        .where(
                            and(
                                eq(participants.firstName, firstName),
                                eq(participants.lastName, lastName)
                            )
                        )
                        .then((res) => res[0]);

                    if (existingUser) {
                        await db.insert(CourseParticipant).values({
                            userId: existingUser.id,
                            courseId,
                        });
                    } else {
                        unaddedParticipants.push(
                            `${firstName} ${lastName}`.trim()
                        );
                    }
                })
            );
        }

        return new Response(JSON.stringify({ courseId, unaddedParticipants }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error processing the request:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
