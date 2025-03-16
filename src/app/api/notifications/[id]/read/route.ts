import { authConfig } from "@/auth";
import db from "@/db";
import { notifications } from "@/db/schema/notifications";
import { broadcastNotification } from "@/lib/websockets";
import { and, eq } from "drizzle-orm";
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

        const notificationToUpdate = await db
            .select()
            .from(notifications)
            .where(
                and(
                    eq(notifications.id, notificationId),
                    eq(notifications.userId, userId)
                )
            )
            .then((res) => res[0]);

        if (!notificationToUpdate) {
            return new Response(
                JSON.stringify({
                    error: "Notification not found",
                }),
                { status: 404 }
            );
        }

        await db
            .update(notifications)
            .set({ isRead: true })
            .where(
                and(
                    eq(notifications.id, notificationId),
                    eq(notifications.userId, userId)
                )
            );

        broadcastNotification({
            id: notificationId,
            userId: userId,
            isRead: true,
            type: notificationToUpdate.type as "course_material" | "homework" | "session_reminder" | "course_acceptance",
            title: notificationToUpdate.title,
            message: notificationToUpdate.message,
            createdAt: notificationToUpdate.createdAt.toISOString(),
            metadata: typeof notificationToUpdate.metadata === 'string'
                ? JSON.parse(notificationToUpdate.metadata)
                : null,
        });

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
