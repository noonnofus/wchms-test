import { authConfig } from "@/auth";
import db from "@/db";
import {
    courseMaterials,
    Difficulty,
    MaterialType,
} from "@/db/schema/courseMaterials";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { validateFile } from "@/lib/fileUploads";
import { getSignedUrlFromFileKey, uploadToS3 } from "@/lib/s3";
import { validateAdminOrStaff } from "@/lib/validation";
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
                        mediaOrigin: "course",
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
