import db from "@/db";
import {
    courseMaterials,
    Difficulty,
    MaterialType,
} from "@/db/schema/courseMaterials";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const {
            id,
            title,
            exerciseType,
            difficulty,
            description,
            uploadId,
            courseId,
        } = body;

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

        // Update the course material
        await db
            .update(courseMaterials)
            .set({
                title,
                type: exerciseType,
                difficulty,
                description,
                uploadId,
                courseId,
            })
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
                    fileData: uploadMedia.fileData,
                },
            })
            .from(courseMaterials)
            .leftJoin(uploadMedia, eq(courseMaterials.uploadId, uploadMedia.id))
            .where(eq(courseMaterials.id, id))
            .then((res) => res[0]);

        return new Response(
            JSON.stringify({
                message: "Course material updated successfully",
                data: { updatedMaterial },
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
