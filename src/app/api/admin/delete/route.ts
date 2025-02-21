import db from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/users";

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) {
            return new Response(
                JSON.stringify({ message: "Missing participant id" }),
                { status: 400 }
            );
        }

        const participant = await db
            .select()
            .from(users)
            .where(eq(users.id, id));

        if (!participant || participant.length === 0) {
            return new Response(JSON.stringify({ error: "Admin not found" }), {
                status: 404,
            });
        }

        await db.delete(users).where(eq(users.id, id));

        return new Response(
            JSON.stringify({
                message: "Admin deleted successfully",
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
