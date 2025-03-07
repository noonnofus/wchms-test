import { eq } from "drizzle-orm";
import db from "@/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";
import { CourseJoinRequests } from "@/db/schema/courseJoinRequests";

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

        if (!body.requestId) {
            return new Response(
                JSON.stringify({ error: "Missing requestId" }),
                {
                    status: 400,
                }
            );
        }

        const request = await db
            .select()
            .from(CourseJoinRequests)
            .where(eq(CourseJoinRequests.id, body.requestId));
        if (!request || request.length === 0) {
            return new Response(
                JSON.stringify({ error: "Request not found" }),
                {
                    status: 404,
                }
            );
        }
        await db
            .delete(CourseJoinRequests)
            .where(eq(CourseJoinRequests.id, body.requestId));

        return new Response(
            JSON.stringify({
                message: "Course Join request deleted successfully",
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
