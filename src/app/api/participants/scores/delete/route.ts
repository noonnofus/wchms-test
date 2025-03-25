import db from "@/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";
import { Scores } from "@/db/schema/score";

export async function DELETE(req: Request) {
    try {
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

        if (!body.scoreId) {
            return new Response(JSON.stringify({ error: "Missing courseId" }), {
                status: 400,
            });
        }
        await db.delete(Scores).where(eq(Scores.id, body.scoreId));
        return new Response(
            JSON.stringify({ message: "Score deleted successfully" }),
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
