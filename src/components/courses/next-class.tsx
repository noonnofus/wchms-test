"use client";
import { getUserCourses } from "@/db/queries/courses";
import { getNextSessionDate } from "@/db/queries/sessions";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function NextClass({ whenLoaded }: { whenLoaded: () => void }) {
    const { t } = useTranslation();
    const [sessionCountdown, setSessionCountdown] = useState<string | null>(
        t("nextSession.none")
    );
    const [courseTitle, setCourseTitle] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);
    const notificationSentRef = useRef<boolean>(false);
    const [sessionId, setSessionId] = useState<number | null>(null); // eslint-disable-line

    const nextSessionDate = async () => {
        try {
            setIsLoading(true);
            const session = await getSession();
            const userId = Number(session?.user.id);
            if (!userId) {
                setSessionCountdown(t("nextSession.none"));
                setIsLoading(false);
                return;
            }

            const classExists = await getUserCourses(userId);
            if (!classExists || classExists.length === 0) {
                setSessionCountdown(t("nextSession.none"));
                setIsLoading(false);
                return;
            }

            const nextSession = await getNextSessionDate();
            if (!nextSession || !("date" in nextSession)) {
                setSessionCountdown(t("nextSession.none"));
                setIsLoading(false);
                return;
            }

            setSessionId(nextSession.id || null);
            setCourseTitle(nextSession.courseTitle || "Class");

            const now = new Date();
            const sessionDate = new Date(nextSession.date);
            const startTime = new Date(nextSession.startTime);
            const endTime = new Date(nextSession.endTime);

            const isSameDay =
                now.getFullYear() === sessionDate.getFullYear() &&
                now.getMonth() === sessionDate.getMonth() &&
                now.getDate() === sessionDate.getDate();

            scheduleSessionReminder(
                userId,
                startTime,
                nextSession.courseTitle,
                nextSession.id
            );

            if (now >= startTime && now <= endTime) {
                setSessionCountdown("Zoom");
            } else if (isSameDay && now < startTime) {
                const timeDiff = startTime.getTime() - now.getTime();
                const hours = Math.floor(timeDiff / (1000 * 3600));
                const minutes = Math.floor(
                    (timeDiff % (1000 * 3600)) / (1000 * 60)
                );

                if (hours > 0) {
                    setSessionCountdown(t("nextSession.hours", { hours }));
                } else {
                    setSessionCountdown(t("nextSession.minutes", { minutes }));
                }
            } else {
                const days = Math.ceil(
                    (sessionDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
                );
                setSessionCountdown(t("nextSession.days", { days }));
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error getting next session", error);
            setSessionCountdown("No Upcoming Sessions");
            setIsLoading(false);
        } finally {
            whenLoaded();
        }
    };

    const scheduleSessionReminder = async (
        userId: number,
        startTime: Date,
        title: string,
        sessionId: number | undefined
    ) => {
        if (sessionId) {
            try {
                const response = await fetch(
                    `/api/notifications/check-reminder?sessionId=${sessionId}`
                );
                const data = await response.json();

                if (data.exists) {
                    notificationSentRef.current = true;
                    return;
                }
            } catch (error) {
                console.error("Error checking for existing reminder:", error);
            }
        }
        if (notificationTimerRef.current) {
            clearTimeout(notificationTimerRef.current);
            notificationTimerRef.current = null;
        }
        notificationSentRef.current = false;

        const now = new Date();
        const timeDiff = startTime.getTime() - now.getTime();
        const tenMinutes = 10 * 60 * 1000;

        if (timeDiff > tenMinutes) {
            const timeUntilNotification = timeDiff - tenMinutes;

            notificationTimerRef.current = setTimeout(() => {
                sendSessionReminder(userId, title, sessionId);
            }, timeUntilNotification);
        } else if (timeDiff > 0 && !notificationSentRef.current) {
            sendSessionReminder(userId, title, sessionId);
        }
    };

    const sendSessionReminder = async (
        userId: number,
        courseTitle: string,
        sessionId: number | undefined
    ) => {
        try {
            if (sessionId) {
                const response = await fetch(
                    `/api/notifications/check-reminder?sessionId=${sessionId}`
                );
                const data = await response.json();

                if (data.exists) {
                    notificationSentRef.current = true;
                    return;
                }
            }
            notificationSentRef.current = true;

            const response = await fetch(
                "/api/notifications/session-reminder",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        courseTitle,
                        sessionId,
                    }),
                }
            );

            if (!response.ok) {
                console.error("Failed to send session reminder notification");
            }
        } catch (error) {
            console.error("Error sending session reminder:", error);
        }
    };

    useEffect(() => {
        nextSessionDate();
        const intervalId = setInterval(nextSessionDate, 60000);
        return () => {
            clearInterval(intervalId);
            if (notificationTimerRef.current) {
                clearTimeout(notificationTimerRef.current);
            }
        };
    }, []);

    return (
        <div
            className={`min-h-[7vh] border-2 border-primary-green rounded-lg items-center justify-center ${isLoading ? "hidden" : "flex"}`}
        >
            {isLoading ? (
                <p className="text-primary-green/50 text-xl md:text-2xl lg:text-3xl animate-pulse">
                    {t("loading")}
                </p>
            ) : sessionCountdown === "Zoom" ? (
                <Link
                    href={"https://us02web.zoom.us/j/96976249949"}
                    className="w-full h-full block"
                >
                    <div className="w-full h-full flex items-center justify-center hover:bg-green-100 transition-colors duration-300 ease-in-out rounded-lg">
                        <p className="text-primary-green text-xl md:text-2xl lg:text-3xl font-semibold">
                            {t("nextSession.zoom", { courseTitle })}
                        </p>
                    </div>
                </Link>
            ) : (
                <p className="text-primary-green text-xl md:text-2xl lg:text-3xl text-center py-2">
                    {sessionCountdown}
                </p>
            )}
        </div>
    );
}
