import db from "@/db";
import { eq } from "drizzle-orm";
import { participants } from "@/db/schema/participants";

export async function DELETE(req: Request) {
    try {
        const { participantId } = await req.json();
        if (!participantId) {
            return new Response(
                JSON.stringify({ message: "Missing participant id" }),
                { status: 400 }
            );
        }

        const participant = await db
            .select()
            .from(participants)
            .where(eq(participants.id, participantId));

        if (!participant || participant.length === 0) {
            return new Response(
                JSON.stringify({ error: "Participant not found" }),
                { status: 404 }
            );
        }

        await db.delete(participants).where(eq(participants.id, participantId));

        return new Response(
            JSON.stringify({
                message: "Participant deleted successfully",
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
