import db from "@/db";
import {
    courseMaterials,
    Difficulty,
    MaterialType,
} from "@/db/schema/courseMaterials";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            title,
            exerciseType,
            difficulty,
            description,
            uploadId,
            courseId,
        } = body;

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

        const newMaterial = await db.insert(courseMaterials).values({
            title,
            type: exerciseType,
            difficulty,
            description,
            uploadId,
            courseId,
        });

        return new Response(
            JSON.stringify({
                message: "Course material created",
                data: newMaterial,
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
