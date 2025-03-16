"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageDropdown } from "../language-dropdown";
import NotificationDropdown from "../notification-dropdown";
import { Notification } from "../notification-system";
import { Button } from "../ui/button";

export default function TopNav() {
    const path = usePathname();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const fetchInitialNotifications = async () => {
            try {
                const response = await fetch("/api/notifications");
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.notifications);
                }
            } catch (error) {
                console.error("Error fetching initial notifications:", error);
            }
        };

        fetchInitialNotifications();
        const connectWebSocket = () => {
            const protocol =
                window.location.protocol === "https:" ? "wss:" : "ws:";
            const wsUrl = `${protocol}//${window.location.host}/api/ws`;

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.addEventListener("open", () => {
                console.log("WebSocket connection established");
            });

            ws.addEventListener("message", (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.event === "notification") {
                        setNotifications((prev) => [
                            data.notification,
                            ...prev,
                        ]);
                    }
                } catch (error) {
                    console.error("Error processing WebSocket message:", error);
                }
            });

            ws.addEventListener("close", () => {
                console.log(
                    "WebSocket connection closed, attempting to reconnect..."
                );
                setTimeout(connectWebSocket, 3000);
            });

            ws.addEventListener("error", (error) => {
                console.error("WebSocket error:", error);
                ws.close();
            });
        };

        connectWebSocket();

        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close();
            }
        };
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            const response = await fetch(`/api/notifications/${id}/read`, {
                method: "PUT",
            });

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((notif) =>
                        notif.id === id ? { ...notif, isRead: true } : notif
                    )
                );
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <div className="p-6 min-h-28 flex items-center">
            <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                    {/* If its not the root page, and admin login page render a button */}
                    {path !== "/" && path !== "/admin" ? (
                        // if its a landing page render a logout page
                        path !== "/landing" && path !== "/admin/landing" ? (
                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                className="inline-flex items-center justify-center gap-0 whitespace-nowrap rounded-md text-sm pl-3 pr-4 py-2 h-9 border-primary-green text-primary-green hover:bg-primary-green hover:text-white hover:stroke-white"
                            >
                                <svg
                                    width="23"
                                    height="24"
                                    viewBox="0 0 23 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-current"
                                >
                                    <g id="chevron-left">
                                        <path
                                            id="Icon"
                                            d="M14.3023 19L7.62792 12L14.3023 5"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                </svg>
                                Back
                            </Button>
                        ) : (
                            <Button
                                asChild
                                variant="outline"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm px-4 py-2 h-9 border-destructive-hover text-destructive-text hover:bg-destructive-hover hover:text-destructive-text"
                            >
                                <Link
                                    href={`/logout?redirect=${path === "/admin/landing" ? `/admin` : "/"}`}
                                >
                                    Logout
                                </Link>
                            </Button>
                        )
                    ) : null}
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <Link
                        href={
                            path.startsWith("/admin")
                                ? "/admin/landing"
                                : "/landing"
                        }
                    >
                        <Image
                            src="/logo.png"
                            alt="West Coast Healthy Memory Society Logo"
                            width={48}
                            height={48}
                        />
                    </Link>
                </div>
                <div className="flex-1 flex items-center justify-end">
                    <LanguageDropdown />
                    <NotificationDropdown
                        notifications={notifications}
                        onMarkAsRead={handleMarkAsRead}
                    />
                </div>
            </div>
        </div>
    );
}
