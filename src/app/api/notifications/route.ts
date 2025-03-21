import { authConfig } from "@/auth";
import db from "@/db";
import { notifications } from "@/db/schema/notifications";
import { validateAdminOrStaff } from "@/lib/validation";
import { desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function GET() {
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

        if (validateAdminOrStaff(session)) {
            const adminNotifications = await db
                .select()
                .from(notifications)
                .where(eq(notifications.type, "admin_notification"))
                .orderBy(desc(notifications.createdAt))
                .limit(5);

            return new Response(
                JSON.stringify({
                    notifications: adminNotifications,
                }),
                { status: 200 }
            );
        }

        // Get all notifications for the user
        const userNotifications = await db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt))
            .limit(5);

        return new Response(
            JSON.stringify({
                notifications: userNotifications,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
