import { authConfig } from "@/auth";
import db from "@/db";
import { notifications } from "@/db/schema/notifications";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

// this function just marks the notification as read, it doesn't return anything
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authConfig);
        if (!session?.user?.id) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized",
                }),
                { status: 401 }
            );
        }

        const userId = parseInt(session.user.id);
        const notificationId = params.id;
        await db
            .update(notifications)
            .set({ isRead: true })
            .where(
                eq(notifications.id, notificationId) &&
                    eq(notifications.userId, userId)
            );

        return new Response(
            JSON.stringify({
                message: "Notification marked as read",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
