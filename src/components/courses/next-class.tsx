import { getUserCourses } from "@/db/queries/courses";
import { getNextSessionDate } from "@/db/queries/sessions";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NextClass() {
    const [sessionCountdown, setSessionCountdown] = useState("No Classes");

    const nextSessionDate = async () => {
        try {
            const session = await getSession();
            const userId = Number(session?.user.id);
            if (!userId) {
                setSessionCountdown("No Classes");
                return;
            }
            const classExists = await getUserCourses(userId);
            if (!classExists || classExists.length === 0) {
                setSessionCountdown("No Classes");
                return;
            }

            const nextSession = await getNextSessionDate();
            if (!nextSession || !("date" in nextSession)) {
                setSessionCountdown("No Sessions");
                return;
            }

            const now = new Date();
            const sessionDate = new Date(nextSession.date);
            const startTime = new Date(nextSession.startTime);
            const endTime = new Date(nextSession.endTime);

            const isSameDay =
                now.getFullYear() === sessionDate.getFullYear() &&
                now.getMonth() === sessionDate.getMonth() &&
                now.getDate() === sessionDate.getDate();

            if (now >= startTime && now <= endTime) {
                setSessionCountdown("Zoom");
            } else if (isSameDay && now < startTime) {
                const timeDiff = startTime.getTime() - now.getTime();
                const hours = Math.floor(timeDiff / (1000 * 3600));
                const minutes = Math.floor(
                    (timeDiff % (1000 * 3600)) / (1000 * 60)
                );

                if (hours > 0) {
                    setSessionCountdown(`Next Session in ${hours} Hours`);
                } else {
                    setSessionCountdown(`Next Session in ${minutes} Minutes`);
                }
            } else {
                const daysTillSession = Math.ceil(
                    (sessionDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
                );
                setSessionCountdown(`Next Session in ${daysTillSession} Days`);
            }
        } catch (error) {
            console.error("Error getting next session", error);
        }
    };

    useEffect(() => {
        nextSessionDate();
        const intervalId = setInterval(nextSessionDate, 60000);
        return () => clearInterval(intervalId);
    }, []);

    if (sessionCountdown === "No Classes") return null;

    return (
        <div className="min-h-[7vh] border-2 border-primary-green rounded-lg flex items-center justify-center">
            {sessionCountdown === "Zoom" ? (
                <Link href={"https://us02web.zoom.us/j/96976249949"}>
                    <p className="text-primary-green text-xl md:text-2xl lg:text-3xl">
                        Launch Zoom Now
                    </p>
                </Link>
            ) : sessionCountdown === "No Sessions" ? (
                <p className="text-primary-green text-xl md:text-2xl lg:text-3xl">
                    No Upcoming Sessions
                </p>
            ) : (
                <p className="text-primary-green text-xl md:text-2xl lg:text-3xl">
                    {sessionCountdown}
                </p>
            )}
        </div>
    );
}
