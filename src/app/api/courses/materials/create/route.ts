import { authConfig } from "@/auth";
import { Notification } from "@/components/notification-system";
import db from "@/db";
import { CourseParticipant, Courses } from "@/db/schema/course";
import {
    courseMaterials,
    Difficulty,
    MaterialType,
} from "@/db/schema/courseMaterials";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { notifications } from "@/db/schema/notifications";
import { validateFile } from "@/lib/fileUploads";
import { getSignedUrlFromFileKey, uploadToS3 } from "@/lib/s3";
import { validateAdminOrStaff } from "@/lib/validation";
import { broadcastNotification } from "@/lib/websockets";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        //Only admins and staff can create course materials
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const exerciseType = formData.get("exerciseType") as MaterialType;
        const difficulty = formData.get("difficulty") as Difficulty;
        const description = formData.get("description") as string;
        let uploadId: string | number | undefined = formData
            .get("uploadId")
            ?.toString();
        const courseId = formData.get("courseId")?.toString();
        const url = formData.get("url")?.toString();
        const file = formData.get("file") as File;
        if (
            !title ||
            !exerciseType ||
            !difficulty ||
            !courseId ||
            !Object.values(MaterialType).includes(exerciseType) ||
            !Object.values(Difficulty).includes(difficulty)
        ) {
            return new Response(
                JSON.stringify({ error: "Invalid input data" }),
                { status: 400 }
            );
        }
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                return new Response(
                    JSON.stringify({
                        validationError,
                    }),
                    { status: 400 }
                );
            }
            const { success, fileName } = await uploadToS3(file);
            if (!success) {
                throw new Error("Failed to upload to S3.");
            }
            if (fileName) {
                uploadId = await db
                    .insert(uploadMedia)
                    .values({
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: file.size,
                        fileKey: fileName,
                        mediaOrigin: "course_materials",
                        ownerId: parseInt(session!.user.id),
                    })
                    .$returningId()
                    .then((res) => res[0].id);
            }
        }
        const insertData = {
            title,
            type: exerciseType,
            difficulty,
            description: description ? description : null,
            uploadId: uploadId ? Number(uploadId) : undefined,
            courseId: parseInt(courseId),
            url: url ? url : null,
        };

        const newMaterial = await db
            .insert(courseMaterials)
            .values(insertData)
            .$returningId()
            .then((res) => res[0]);

        const insertedMaterial = await db
            .select({
                id: courseMaterials.id,
                title: courseMaterials.title,
                type: courseMaterials.type,
                difficulty: courseMaterials.difficulty,
                description: courseMaterials.description,
                courseId: courseMaterials.courseId,
                createdAt: courseMaterials.createdAt,
                uploadId: courseMaterials.uploadId,
                file: {
                    fileName: uploadMedia.fileName,
                    fileType: uploadMedia.fileType,
                    fileSize: uploadMedia.fileSize,
                    fileKey: uploadMedia.fileKey,
                },
                url: courseMaterials.url,
            })
            .from(courseMaterials)
            .leftJoin(uploadMedia, eq(courseMaterials.uploadId, uploadMedia.id))
            .where(eq(courseMaterials.id, newMaterial.id))
            .then((res) => res[0]);
        if (!insertedMaterial.url) {
            if (insertedMaterial.file) {
                insertedMaterial.url = await getSignedUrlFromFileKey(
                    insertedMaterial.file.fileKey,
                    true,
                    insertedMaterial.file.fileName
                );
            }
        }

        const enrolledUsers = await db
            .select({ userId: CourseParticipant.userId })
            .from(CourseParticipant)
            .where(eq(CourseParticipant.courseId, parseInt(courseId)));

        if (enrolledUsers.length > 0) {
            const course = await db
                .select({ title: Courses.title })
                .from(Courses)
                .where(eq(Courses.id, parseInt(courseId)))
                .then((res) => res[0]);

            const courseTitle = course?.title || "your course";
            const materialTypeName =
                exerciseType.charAt(0).toUpperCase() +
                exerciseType.slice(1).replace("_", " ");

            const notificationPromises = enrolledUsers.map(async (user) => {
                // Insert the notification into the database
                const notificationId = await db
                    .insert(notifications)
                    .values({
                        type: "course_material",
                        title: `New ${materialTypeName} Available`,
                        message: `"${title}" had added you to ${courseTitle}.`,
                        userId: user.userId,
                        createdAt: new Date(),
                        metadata: JSON.stringify({
                            courseId: parseInt(courseId),
                            materialId: newMaterial.id,
                        }),
                        isRead: false,
                    })
                    .$returningId()
                    .then((res) => res[0].id);

                const notification: Notification = {
                    id: notificationId.toString(),
                    type: "course_material",
                    title: `New ${materialTypeName} Available`,
                    message: `"${title}" has been added to ${courseTitle}.`,
                    userId: user.userId,
                    isRead: false,
                    metadata: {
                        courseId: parseInt(courseId),
                        materialId: newMaterial.id,
                    },
                };

                // Broadcast the notification
                broadcastNotification(notification);

                return notification;
            });

            await Promise.all(notificationPromises);
        }

        return new Response(
            JSON.stringify({
                message: "Course material created",
                data: insertedMaterial,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
