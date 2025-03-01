import db from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/users";
import { authConfig } from "@/auth";
import { getServerSession } from "next-auth";
import { validateAdmin } from "@/lib/validation";

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) {
            return new Response(
                JSON.stringify({ message: "Missing participant id" }),
                { status: 400 }
            );
        }

        const session = await getServerSession(authConfig);

        //Only admins can delete admins/staff or they can delete themselves
        if (!validateAdmin(session) && session?.user.id !== id.toString()) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
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
