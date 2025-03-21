import { Card } from "@/components/ui/card";
import { Book, Clock } from "lucide-react";
import { Session } from "@/db/schema/session";
import EditIcon from "../icons/edit-icon";
import DeleteIcon from "../icons/delete-icon";
import { Score } from "@/db/schema/score";
import { getSessionById } from "@/db/queries/sessions";
import { useEffect, useState } from "react";
import { getCourseById } from "@/db/queries/courses";
import { CourseFull } from "@/db/schema/course";
import { getStaffById } from "@/db/queries/admins";
import { UserNoPass } from "@/app/admin/manage/staff/page";

export default function ScoreCard({
    score,
    handleDeleteButtonClick,
    handleEditButtonClick,
    isAdmin,
    variant,
}: {
    score: Score;
    handleDeleteButtonClick?: (score: Score) => void;
    handleEditButtonClick?: (score: Score) => void;
    isAdmin?: boolean;
    variant?: "list";
}) {
    const [session, setSession] = useState<Session | null>(null);
    const [course, setCourse] = useState<CourseFull | null | undefined>(
        undefined
    );
    const [instructor, setInstructor] = useState<UserNoPass | null>(null);
    const formattedTime = () => {
        const minutes = Math.floor(score.time / 60);
        const seconds = Math.floor(score.time % 60);

        const minuteText = minutes === 1 ? "min" : "mins";
        const secondText = seconds === 1 ? "sec" : "secs";

        if (seconds === 0) {
            return `${minutes} ${minuteText}`;
        }

        if (minutes === 0) {
            return `${seconds} ${secondText}`;
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
            setCourse(course);
        };
        fetchCourse();

        const fetchInstructor = async () => {
            if (!session || session.instructorId === null) return;
            const instructor = await getStaffById(session.instructorId);
            setInstructor(instructor);
        };
        fetchInstructor();
    }, [session]);

    return (
        <div className="flex flex-col items-center w-full">
            <Card
                className={`flex flex-col justify-between items-center gap-4 p-4 shadow-lg rounded-lg bg-white ${variant === "list" ? "w-56 h-48" : "w-full"}`}
            >
                <div
                    className={`w-full flex justify-between gap-4 text-gray-500 ${variant === "list" ? "flex-col" : "flex-row"}`}
                >
                    <div className="flex gap-2">
                        <Book />
                        <span className="font-semibold">
                            Course: {course?.title}
                        </span>
                    </div>
                    <span>Recorded By: {instructor?.firstName}</span>
                </div>
                <div className="w-full flex flex-row gap-4 justify-between items-end h-24">
                    <div className="flex items-center gap-4 text-gray-700">
                        <div className="flex flex-col gap-2 justify-center">
                            <span className="font-semibold">
                                {session?.date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                            <div className="flex gap-2 items-center">
                                <Clock className="w-6 h-6 text-gray-500" />
                                <span className="whitespace-nowrap">
                                    {formattedTime()}
                                </span>
                            </div>
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
