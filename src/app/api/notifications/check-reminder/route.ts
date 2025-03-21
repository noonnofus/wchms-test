import { authConfig } from "@/auth";
import db from "@/db";
import { notifications } from "@/db/schema/notifications";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authConfig);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const url = new URL(req.url);
        const sessionId = url.searchParams.get("sessionId");

        if (!sessionId) {
            return new Response(
                JSON.stringify({ error: "Missing sessionId parameter" }),
                { status: 400 }
            );
        }

        const userId = Number(session.user.id);

        const existingNotifications = await db
            .select()
            .from(notifications)
            .where(
                and(
                    eq(notifications.userId, userId),
                    eq(notifications.type, "session_reminder")
                )
            );

        const exists = existingNotifications.some((notification) => {
            try {
                const metadata = JSON.parse(
                    String(notification.metadata || "")
                );
                return metadata.sessionId === Number(sessionId);
            } catch {
                return false;
            }
        });

        return new Response(JSON.stringify({ exists }), { status: 200 });
    } catch (error) {
        console.error("Error checking for existing notification:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
