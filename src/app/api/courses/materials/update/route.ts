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

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        //Only admins and staff can update course materials
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
        const formData = await req.formData();
        const id = parseInt(formData.get("id") as string);
        const title = formData.get("title") as string;
        const exerciseType = formData.get("exerciseType") as MaterialType;
        const difficulty = formData.get("difficulty") as Difficulty;
        const description = formData.get("description") as string;
        let uploadId: string | number | undefined = formData
            .get("uploadId")
            ?.toString();
        const courseId = parseInt(formData.get("courseId") as string);
        const file = formData.get("file") as File | null;
        let fileKey = formData.get("fileKey") as string;

        if (!id) {
            return new Response(
                JSON.stringify({ error: "Material ID is required" }),
                { status: 400 }
            );
        }

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
        let url: undefined | string;
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
            //
            const { success, fileName } = await uploadToS3(file, fileKey);
            if (!success) {
                throw new Error("Failed to upload to S3.");
            }
            if (fileKey && uploadId) {
                await db
                    .update(uploadMedia)
                    .set({
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: file.size,
                    })
                    .where(eq(uploadMedia.id, Number(uploadId)));
            }
            if (fileName && !fileKey) {
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
                url = await getSignedUrlFromFileKey(fileName, true, file.name);
            }
        }
        const newData = {
            title,
            type: exerciseType,
            difficulty,
            description,
            uploadId: Number(uploadId),
            courseId,
        };
        // Update the course material
        await db
            .update(courseMaterials)
            .set(newData)
            .where(eq(courseMaterials.id, id));

        const updatedMaterial = await db
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
            })
            .from(courseMaterials)
            .leftJoin(uploadMedia, eq(courseMaterials.uploadId, uploadMedia.id))
            .where(eq(courseMaterials.id, id))
            .then((res) => res[0]);

        return new Response(
            JSON.stringify({
                message: "Course material updated successfully",
                data: { ...updatedMaterial, url },
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
