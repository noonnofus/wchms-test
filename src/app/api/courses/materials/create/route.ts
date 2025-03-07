import { authConfig } from "@/auth";
import db from "@/db";
import {
    courseMaterials,
    Difficulty,
    MaterialType,
} from "@/db/schema/courseMaterials";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { getSignedUrlFromFileKey } from "@/lib/s3";
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
        const body = await req.json();
        const {
            title,
            exerciseType,
            difficulty,
            description,
            uploadId,
            courseId,
            url,
        } = body;
        console.log(body);

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

        const insertData = {
            title,
            type: exerciseType,
            difficulty,
            description: description ? description : null,
            uploadId,
            courseId,
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
