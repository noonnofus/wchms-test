import { authConfig } from "@/auth";
import db from "@/db";
import { notifications } from "@/db/schema/notifications";
import { broadcastNotification } from "@/lib/websockets";
import { and, eq, or } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

interface Params {
    slug: string;
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const resolvedParams = await params;
    const notificationId = String(resolvedParams.slug);

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

        const notificationToUpdate = await db
            .select()
            .from(notifications)
            .where(
                or(
                    and(
                        eq(notifications.id, notificationId),
                        eq(notifications.userId, userId)
                    ),
                    and(
                        eq(notifications.id, notificationId),
                        eq(notifications.type, "admin_notification")
                    )
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
            .where(eq(notifications.id, notificationId));

        broadcastNotification({
            id: notificationId,
            userId: notificationToUpdate.userId ?? undefined,
            isRead: true,
            type: notificationToUpdate.type as
                | "course_material"
                | "homework"
                | "session_reminder"
                | "course_acceptance"
                | "admin_notification",
            metadata:
                typeof notificationToUpdate.metadata === "string"
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
