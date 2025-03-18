import { rooms } from "@/db/schema/room";
import { eq } from "drizzle-orm";
import db from "@/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";
import { deleteFromS3 } from "@/lib/s3";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { courseMaterials } from "@/db/schema/courseMaterials";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        //Only admins and staff can delete courses
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
        const body = await req.json();

        if (!body.id) {
            return new Response(JSON.stringify({ error: "Missing room id" }), {
                status: 400,
            });
        }

        // Validate if course exists
        const room = await db
            .select()
            .from(rooms)
            .where(eq(rooms.id, body.id))
            .then((res) => res[0]);

        if (!room) {
            return new Response(JSON.stringify({ error: "Room not found" }), {
                status: 404,
            });
        }

        await db.delete(rooms).where(eq(rooms.id, body.id));

        return new Response(
            JSON.stringify({
                message: "Room deleted successfully",
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
