import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Session } from "@/db/schema/session";
import EditIcon from "../icons/edit-icon";
import DeleteIcon from "../icons/delete-icon";
import { Score } from "@/db/schema/score";
import { getSessionById } from "@/db/queries/sessions";
import { useEffect, useState } from "react";
import { getCourseById } from "@/db/queries/courses";
import { CourseFull } from "@/db/schema/course";

export default function ScoreCard({
    score,
    handleDeleteButtonClick,
    handleEditButtonClick,
    isAdmin,
}: {
    score: Score;
    handleDeleteButtonClick?: (scpre: Score) => void;
    handleEditButtonClick?: (score: Score) => void;
    isAdmin?: boolean;
}) {
    const [session, setSession] = useState<Session | null>(null);
    const [course, setCourse] = useState<CourseFull | null | undefined>(
        undefined
    );
    const formattedTime = () => {
        const minutes = Math.floor(score.time / 60);
        const seconds = Math.floor(score.time % 60);

        const minuteText = minutes === 1 ? "minute" : "minutes";
        const secondText = seconds === 1 ? "second" : "seconds";

        if (seconds === 0) {
            return `${minutes} ${minuteText}`;
        }

        return `${minutes} ${minuteText} and ${seconds.toString().padStart(2, "0")} ${secondText}`;
    };

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSessionById(score.sessionId);
            setSession(session);
        };
        fetchSession();
    }, [score.sessionId]);

    useEffect(() => {
        if (!session) return;

        const fetchCourse = async () => {
            const course = await getCourseById(session.courseId);
            console.log(course);
            setCourse(course);
        };
        fetchCourse();
    }, [session]);

    return (
        <div className="flex flex-col items-center w-full">
            <Card className="w-full h-full flex flex-col justify-between items-center gap-4 p-4 shadow-lg rounded-lg bg-white">
                <div className="w-full flex flex-row justify-start gap-4">
                    <Clock className="w-6 h-6 text-gray-500" />
                    <span className="font-semibold">
                        Course: {course?.title}
                    </span>
                </div>
                <div className="w-full flex flex-row gap-4 justify-between items-center ">
                    <div className="flex items-center gap-4 text-gray-700">
                        <div className="flex flex-col justify-center">
                            <span className="font-semibold">
                                {session?.date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                            <span>{formattedTime()}</span>
                        </div>
                    </div>
                    {isAdmin &&
                        handleDeleteButtonClick &&
                        handleEditButtonClick && (
                            <div className="flex flex-row gap-2 items-center">
                                <button
                                    onClick={() => handleEditButtonClick(score)}
                                >
                                    <EditIcon />
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteButtonClick(score)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        )}
                </div>
            </Card>
        </div>
    );
}
