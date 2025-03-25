"use client";
import { getNotificationContent } from "@/lib/notification-service";
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
        | "course_acceptance"
        | "admin_notification";
    userId?: number;
    isRead: boolean;
    metadata?: {
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
}

export interface WS extends WebSocket {
    pingInterval: NodeJS.Timeout;
}

const NotificationSystem: React.FC = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
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
                ws.send(JSON.stringify({ event: "identify", userId }));

                const pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ event: "ping" }));
                    }
                }, 30000);
                (ws as WS).pingInterval = pingInterval;
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data as string);

                    // Handle different event types
                    if (data.event === "notification" && data.notification) {
                        const notification = data.notification as Notification;

                        if (notification.userId === Number(userId)) {
                            displayToast(notification);
                        }
                    }
                } catch (error) {
                    console.error("Error parsing websocket message:", error);
                }
            };

            ws.onclose = () => {
                clearInterval((ws as WS).pingInterval);
                setTimeout(connectWebSocket, 3000);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                ws.close();
            };

            setSocket(ws);
        };

        connectWebSocket();

        return () => {
            if (socket) {
                clearInterval((socket as WS).pingInterval);
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

        const { title, icon } = getNotificationContent(
            notification.type,
            notification.metadata
        );
        toast.info(`${icon} ${title}`, toastOptions);
    };

    return (
        <>
            <ToastContainer />
        </>
    );
};

export default NotificationSystem;
