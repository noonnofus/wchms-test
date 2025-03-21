import db from "@/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";
import { Scores } from "@/db/schema/score";

export async function POST(req: Request) {
    const session = await getServerSession(authConfig);

    if (!validateAdminOrStaff(session)) {
        return new Response(
            JSON.stringify({
                error: "Unauthorized: insufficient permissions",
            }),
            { status: 401 }
        );
    }

    const body = await req.json();
    console.log(body);

    if (
        !body.sessionId ||
        !body.time ||
        !body.participantId ||
        !body.instructorId
    ) {
        return new Response(
            JSON.stringify({ error: "Missing required fields" }),
            { status: 400 }
        );
    }

    try {
        const score = await db.insert(Scores).values({
            time: body.time,
            participantId: body.participantId,
            instructorId: body.instructorId,
            sessionId: body.sessionId,
        });

        return new Response(
            JSON.stringify({ message: "Score added successfully", score }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error inserting score:", error);

        return new Response(
            JSON.stringify({ error: "Failed to insert score" }),
            { status: 500 }
        );
    }
}
