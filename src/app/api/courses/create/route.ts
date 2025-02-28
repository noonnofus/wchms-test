import db from "@/db";
import { eq, and } from "drizzle-orm";
import { CourseParticipant, Courses } from "@/db/schema/course";
import { rooms } from "@/db/schema/room";
import { participants } from "@/db/schema/participants";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";

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

        const body = await req.json();
        if (
            !body.courseName ||
            !body.courseDescription ||
            !body.courseStartDate ||
            !body.courseEndDate
        ) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        if (
            body.courseName.length > 255 ||
            body.courseDescription.length > 255
        ) {
            return new Response(
                JSON.stringify({
                    error: "Course Name/Description character limit exceeded",
                }),
                { status: 400 }
            );
        }
        const startDate = new Date(body.courseStartDate);
        const endDate = new Date(body.courseEndDate);
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

        const roomId = parseInt(body.courseRoom);
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

        const courseId = await db
            .insert(Courses)
            .values({
                title: body.courseName,
                description: body.courseDescription,
                start: startDate,
                end: endDate,
                lang: body.courseLanguage,
                status: body.courseStatus,
                kind: body.courseType,
                uploadId: body.uploadId,
                roomId,
            })
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
        if (body.courseParticipants) {
            const participantsArr = body.courseParticipants.split(",");

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
