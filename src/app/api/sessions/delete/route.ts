import db from "@/db";
import { eq } from "drizzle-orm";
import { Sessions } from "@/db/schema/session";

// TODO: secure route for admins only
export async function DELETE(req: Request) {
    try {
        const body = await req.json();

        if (!body.sessionId) {
            return new Response(
                JSON.stringify({ error: "Session ID is required" }),
                { status: 400 }
            );
        }

        const session = await db
            .select()
            .from(Sessions)
            .where(eq(Sessions.id, body.sessionId))
            .then((res) => res[0]);

        if (!session) {
            return new Response(
                JSON.stringify({ error: "Session not found" }),
                { status: 404 }
            );
        }

        await db.delete(Sessions).where(eq(Sessions.id, body.sessionId));

        return new Response(
            JSON.stringify({ message: "Session successfully deleted" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting session:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
