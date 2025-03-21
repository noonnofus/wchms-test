import { authConfig } from "@/auth";
import { Notification } from "@/components/notification-system";
import db from "@/db";
import { notifications, NotificationType } from "@/db/schema/notifications";
import { broadcastNotification } from "@/lib/websockets";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authConfig);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const { userId, courseTitle, sessionId, sessionDate } =
            await req.json();

        if (!userId || !courseTitle) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        const title = "Class Starting Soon";
        const message = `Your session will start in 10 minutes for ${courseTitle}.`;

        const courseId = sessionId
            ? Number(sessionId.toString().split("-")[0])
            : undefined;

        const metadata = {
            courseId: courseId,
            courseName: courseTitle,
            sessionId: sessionId || undefined,
            sessionDate: sessionDate || undefined,
        };

        const notificationId = await db
            .insert(notifications)
            .values({
                type: "session_reminder",
                userId,
                createdAt: new Date(),
                metadata: JSON.stringify(metadata),
                isRead: false,
            })
            .$returningId()
            .then((res) => res[0].id);

        const notification: Notification = {
            id: notificationId.toString(),
            type: "session_reminder" as NotificationType,
            userId,
            isRead: false,
            metadata,
        };

        broadcastNotification(notification);

        return new Response(
            JSON.stringify({
                message: "Session reminder notification sent",
                notification,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error sending session reminder notification:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
