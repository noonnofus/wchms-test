import { NotificationType } from "@/db/schema/notifications";

export type NotificationMetadata = {
    courseId?: number;
    courseName?: string;
    materialId?: number;
    materialName?: string;
    materialType?: string;
    homeworkId?: number;
    homeworkName?: string;
    sessionId?: number;
    sessionDate?: string;
};

export interface NotificationDisplay {
    title: string;
    message: string;
    icon: string;
}
// If you need to edit any notification content
export function getNotificationContent(
    type: NotificationType,
    metadata: NotificationMetadata = {}
): NotificationDisplay {
    switch (type) {
        // metadata isnt being used due to translation
        case "course_material":
            return {
                title: `New ${metadata.materialType || "Material"} Available`,
                message: metadata.materialName
                    ? `"${metadata.materialName}" has been added to ${metadata.courseName || "your course"}.`
                    : `New material has been added to ${metadata.courseName || "your course"}.`,
                icon: "📚",
            };

        case "homework":
            return {
                title: `New Assignment`,
                message: metadata.homeworkName
                    ? `"${metadata.homeworkName}" has been assigned in ${metadata.courseName || "your course"}.`
                    : `A new assignment has been added to ${metadata.courseName || "your course"}.`,
                icon: "📝",
            };

        case "session_reminder":
            return {
                title: `Upcoming Session Reminder`,
                message: metadata.sessionDate
                    ? `You have a session scheduled for ${metadata.sessionDate} in ${metadata.courseName || "your course"}.`
                    : `You have an upcoming session in ${metadata.courseName || "your course"}.`,
                icon: "⏰",
            };

        case "course_acceptance":
            return {
                title: `Course Enrollment Approved`,
                message: metadata.courseName
                    ? `Your enrollment in ${metadata.courseName} has been approved.`
                    : `Your course enrollment has been approved.`,
                icon: "🎉",
            };
        case "course_invite":
            return {
                title: `New Course Invitation`,
                message: metadata.courseName
                    ? `You've been invited to join ${metadata.courseName}.`
                    : `You've been invited to join a new course.`,
                icon: "📩",
            };

        default:
            return {
                title: "New Notification",
                message: "You have a new notification.",
                icon: "📣",
            };
    }
}
