"use client";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageDropdown } from "../language-dropdown";
import NotificationDropdown from "../notification-dropdown";
import { Notification } from "../notification-system";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export default function TopNav() {
    const path = usePathname();
    const router = useRouter();
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);

    const isParticipantPage =
        !path.startsWith("/admin") &&
        path !== "/" &&
        path !== "/login" &&
        path !== "/register";

    const initializeUserData = async () => {
        try {
            const session = await getSession();
            const userId = Number(session?.user.id);
            const userLoggedIn = !!userId;

            setIsLoggedIn(userLoggedIn);

            if (userLoggedIn) {
                fetchNotifications();
                initializeWebSocket(userId);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch("/api/notifications");
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const initializeWebSocket = (userId: number) => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/api/ws`;

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
        }

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("WebSocket connected");
            if (userId) {
                ws.send(
                    JSON.stringify({
                        event: "identify",
                        userId: userId,
                    })
                );
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("WebSocket message received:", data);

                if (data.event === "notification" && data.notification) {
                    const newNotification = data.notification as Notification;
                    setNotifications((prev) => [newNotification, ...prev]);
                }
            } catch (error) {
                console.error("Error with websocket:", error);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket closed, reconnecting...");
            setTimeout(() => {
                const newWs = new WebSocket(wsUrl);
                setSocket(newWs);
            }, 3000);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            ws.close();
        };

        setSocket(ws);
    };

    useEffect(() => {
        initializeUserData();

        const intervalId = setInterval(fetchNotifications, 30000);
        return () => {
            clearInterval(intervalId);
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []);

    useEffect(() => {
        initializeUserData();
    }, [path]);

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
            {isOpen ? (
                <div
                    className="absolute inset-0 opacity-100"
                    onClick={(e: React.FormEvent) => {
                        e.preventDefault();
                        setIsOpen(false);
                    }}
                ></div>
            ) : (
                <></>
            )}
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
                                {t("back")}
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
                                    {t("logout")}
                                </Link>
                            </Button>
                        )
                    ) : null}
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <Link href="/landing">
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
                    {isLoggedIn && (
                        <div className="ml-6">
                            <NotificationDropdown
                                notifications={notifications}
                                onMarkAsRead={handleMarkAsRead}
                                setIsOpen={setIsOpen}
                                isOpen={isOpen}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
