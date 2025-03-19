"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface Notification {
    id: string;
    type:
        | "course_material"
        | "homework"
        | "session_reminder"
        | "course_acceptance";
    title: string;
    message: string;
    userId: number;
    isRead: boolean;
    metadata?: {
        courseId?: number;
        materialId?: number;
        homeworkId?: number;
        sessionId?: number;
    };
}

const NotificationSystem: React.FC = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]); // eslint-disable-line
    const { data: session } = useSession();
    const userId = session?.user?.id;

    useEffect(() => {
        if (!userId) return;

        const connectWebSocket = () => {
            const protocol =
                window.location.protocol === "https:" ? "wss:" : "ws:";
            const wsUrl = `${protocol}//${window.location.host}/api/ws`;
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("WebSocket connected");
                ws.send(JSON.stringify({ event: "identify", userId }));

                const pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ event: "ping" }));
                    }
                }, 30000);
                (ws as any).pingInterval = pingInterval; // eslint-disable-line
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data as string);

                    // Handle different event types
                    if (data.event === "notification" && data.notification) {
                        const notification = data.notification as Notification;

                        if (notification.userId === Number(userId)) {
                            setNotifications((prev) => [notification, ...prev]);

                            displayToast(notification);
                        }
                    }
                } catch (error) {
                    console.error("Error parsing websocket message:", error);
                }
            };

            ws.onclose = () => {
                console.log(
                    "WebSocket disconnected. Attempting to reconnect..."
                );
                clearInterval((ws as any).pingInterval); // eslint-disable-line

                setTimeout(connectWebSocket, 3000);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                ws.close();
            };

            setSocket(ws);
        };

        connectWebSocket();

        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/notifications");
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.notifications);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();

        return () => {
            if (socket) {
                // eslint-disable-line
                clearInterval((socket as any).pingInterval); // eslint-disable-line

                socket.close();
            }
        };
    }, [userId]);

    const displayToast = (notification: Notification) => {
        const toastOptions: ToastOptions = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        };

        switch (notification.type) {
            case "course_material":
                toast.info(`📚 ${notification.title}`, toastOptions);
                break;
            case "homework":
                toast.info(`📝 ${notification.title}`, toastOptions);
                break;
            case "session_reminder":
                toast.info(`⏰ ${notification.title}`, toastOptions);
                break;
            case "course_acceptance":
                toast.success(`🎉 ${notification.title}`, toastOptions);
                break;
            default:
                toast.info(notification.title, toastOptions);
        }
    };

    // const markAsRead = async (notificationId: string) => {
    //     try {
    //         const response = await fetch(
    //             `/api/notifications/${notificationId}/read`,
    //             {
    //                 method: "PUT",
    //             }
    //         );

    //         if (response.ok) {
    //             setNotifications((prev) =>
    //                 prev.map((notif) =>
    //                     notif.id === notificationId
    //                         ? { ...notif, isRead: true }
    //                         : notif
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Error marking notification as read:", error);
    //     }
    // };

    return (
        <>
            <ToastContainer />
        </>
    );
};

export default NotificationSystem;
