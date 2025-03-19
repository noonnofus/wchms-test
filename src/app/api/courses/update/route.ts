import db from "@/db";
import { eq } from "drizzle-orm";
import { Courses } from "@/db/schema/course";
import { rooms } from "@/db/schema/room";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";
import { uploadToS3 } from "@/lib/s3";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { validateImage } from "@/lib/fileUploads";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        //Only admins and staff can edit courses
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
        const courseId = parseInt(formData.get("courseId") as string);
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

        const courseImage = formData.get("courseImage") as File | null;
        const fileKey = formData.get("fileKey") as string;
        if (
            !courseId ||
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

        // Check for valid start and end dates
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

        // Validate Room Id
        const roomId = parseInt(courseRoom);
        if (!roomId || roomId === -1) {
            return new Response(
                JSON.stringify({
                    error: "Missing Room Id",
                }),
                { status: 400 }
            );
        }

        // Validate Room Exists
        const room = await db.select().from(rooms).where(eq(rooms.id, roomId));
        if (!room || room.length === 0) {
            return new Response(
                JSON.stringify({
                    error: "Invalid Room Id",
                }),
                { status: 400 }
            );
        }

        // Validate Course Exists
        const course = await db
            .select()
            .from(Courses)
            .where(eq(Courses.id, courseId));
        if (!course || course.length === 0) {
            return new Response(
                JSON.stringify({
                    error: "Course not found",
                }),
                { status: 404 }
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
            const { success, fileName } = await uploadToS3(
                courseImage,
                fileKey
            );
            if (!success) {
                throw new Error("Failed to upload to S3.");
            }
            if (fileName && !fileKey) {
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
        const updatedData = {
            title: courseName,
            description: courseDescription,
            start: startDate,
            end: endDate,
            lang: courseLanguage,
            status: courseStatus,
            kind: courseType,
            ...(uploadId ? { uploadId: Number(uploadId) } : {}),
            roomId,
        };
        if (uploadId) {
            updatedData.uploadId = uploadId;
        }
        // Update Course
        await db
            .update(Courses)
            .set(updatedData)
            .where(eq(Courses.id, courseId));

        const updatedCourse = await db
            .select()
            .from(Courses)
            .where(eq(Courses.id, courseId));

        // Respond with the updated course id
        return new Response(JSON.stringify({ courseId: updatedCourse[0].id }), {
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
