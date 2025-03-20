import { authConfig } from "@/auth";
import { Notification } from "@/components/notification-system";
import db from "@/db";
import { CourseParticipant, Courses } from "@/db/schema/course";
import { notifications } from "@/db/schema/notifications";
import { validateAdminOrStaff } from "@/lib/validation";
import { broadcastNotification } from "@/lib/websockets";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

        const { userId, courseId } = await req.json();

        if (!userId || !courseId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await db.insert(CourseParticipant).values({
            userId,
            courseId,
        });

        const course = await db
            .select({ title: Courses.title })
            .from(Courses)
            .where(eq(Courses.id, courseId))
            .then((res) => res[0]);

        const courseTitle = course?.title || "your course";

        const notificationId = await db
            .insert(notifications)
            .values({
                type: "course_acceptance",
                title: "Course Enrollment Approved",
                message: `You have been approved into "${courseTitle}".`,
                userId: userId,
                createdAt: new Date(),
                metadata: JSON.stringify({
                    courseId: courseId,
                }),
                isRead: false,
            })
            .$returningId()
            .then((res) => res[0].id);

        const notification: Notification = {
            id: notificationId.toString(),
            type: "course_acceptance",
            title: "Course Enrollment Approved",
            message: `You have been approved into "${courseTitle}".`,
            userId: userId,
            isRead: false,
            metadata: {
                courseId: courseId,
            },
        };
        broadcastNotification(notification);

        return NextResponse.json(
            { message: "Participant added successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding participant:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
