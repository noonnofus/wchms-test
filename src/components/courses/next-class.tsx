import { getUserCourses } from "@/db/queries/courses";
import { getNextSessionDate } from "@/db/queries/sessions";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NextClass() {
    const [daysTillSession, setDaysTillSession] = useState("No Classes");

    const nextSessionDate = async () => {
        try {
            const session = await getSession();
            const userId = Number(session?.user.id);
            if (!userId) {
                setDaysTillSession("No Classes");
                return;
            }
            const classExists = await getUserCourses(userId);
            if (!classExists || classExists.length === 0) {
                setDaysTillSession("No Classes");
                return;
            }

            const nextSession = await getNextSessionDate();
            if (!nextSession || !("date" in nextSession)) {
                setDaysTillSession("No Sessions");
                return;
            }

            const now = new Date();
            const sessionDate = new Date(nextSession.date);
            const startTime = new Date(nextSession.startTime);
            const endTime = new Date(nextSession.endTime);

            if (now >= startTime && now <= endTime) {
                setDaysTillSession("Zoom");
            } else {
                const daysTillSession = Math.ceil(
                    (sessionDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
                );
                setDaysTillSession(daysTillSession.toString());
            }
        } catch (error) {
            console.error("Error getting next session", error);
        }
    };

    useEffect(() => {
        nextSessionDate();
    }, []);

    if (daysTillSession === "No Classes") return null;

    return (
        <div className="min-h-[7vh] border-2 border-primary-green rounded-lg flex items-center justify-center">
            {daysTillSession === "Zoom" ? (
                <Link href={"https://us02web.zoom.us/j/96976249949"}>
                    <p className="text-primary-green text-xl md:text-2xl lg:text-3xl">
                        Launch Zoom Now
                    </p>
                </Link>
            ) : daysTillSession === "No Sessions" ? (
                <p className="text-primary-green text-xl md:text-2xl lg:text-3xl">
                    No Upcoming Sessions
                </p>
            ) : (
                <p className="text-primary-green text-xl md:text-2xl lg:text-3xl">
                    Next Session in <strong>{daysTillSession} Days</strong>
                </p>
            )}
        </div>
    );
}
