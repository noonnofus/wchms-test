import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Notification } from "./notification-system";

interface NotificationDropdownProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    isOpen: boolean;
    setIsOpen: (openValue: boolean) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    notifications,
    onMarkAsRead,
    isOpen,
    setIsOpen,
}) => {
    const router = useRouter();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const getIcon = (type: string) => {
        switch (type) {
            case "course_material":
                return "📚";
            case "homework":
                return "📝";
            case "session_reminder":
                return "⏰";
            case "course_acceptance":
                return "🎉";
            default:
                return "📣";
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }

        let metadata = notification.metadata;
        if (typeof metadata === "string") {
            try {
                metadata = JSON.parse(metadata);
            } catch (e) {
                console.error("Failed to parse notification metadata:", e);
            }
        }
        if (metadata) {
            const { courseId, materialId, homeworkId, sessionId } = metadata;

            if (courseId && materialId) {
                router.push(`/courses/${courseId}/`);
            } else if (courseId && homeworkId) {
                router.push(`/courses/${courseId}/homework/${homeworkId}`);
            } else if (sessionId) {
                router.push(`/landing`);
            } else if (courseId) {
                router.push(`/courses/${courseId}`);
            }
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                className="p-2 rounded-full hover:bg-gray-100 relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-medium">Notifications</h3>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No notifications yet
                        </div>
                    ) : (
                        <div>
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${!notification.isRead ? "bg-blue-50" : ""}`}
                                    onClick={() =>
                                        handleNotificationClick(notification)
                                    }
                                >
                                    <div className="flex">
                                        <span className="text-2xl mr-3">
                                            {getIcon(notification.type)}
                                        </span>
                                        <div className="flex-1">
                                            <h4 className="font-medium">
                                                {notification.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
