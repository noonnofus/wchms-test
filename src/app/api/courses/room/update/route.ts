import db from "@/db";
import { eq } from "drizzle-orm";
import { rooms } from "@/db/schema/room";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdmin } from "@/lib/validation";

export async function PUT(req: Request) {
    try {
        const {
            id,
            name,
            medium,
            url,
            capacity,
            status,
            description,
            internalNote,
        } = await req.json();

        if (!id || !name || !medium || !status) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        const session = await getServerSession(authConfig);
        const isAdmin = validateAdmin(session);
        //Only admins can update users, or users themselves
        if (!isAdmin && session?.user.id !== id.toString()) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }

        const room = await db.select().from(rooms).where(eq(rooms.id, id));

        if (!room || room.length === 0) {
            return new Response(JSON.stringify({ error: "Room not found" }), {
                status: 404,
            });
        }

        await db
            .update(rooms)
            .set({
                name: name,
                medium: medium,
                url: url,
                capacity: capacity,
                status: status,
                description: description,
                internalNote: internalNote,
            })
            .where(eq(rooms.id, id));

        return new Response(
            JSON.stringify({ message: "Room updated successfully" }),
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
