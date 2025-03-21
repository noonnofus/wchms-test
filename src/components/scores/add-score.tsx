import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { UserNoPass } from "@/app/admin/manage/staff/page";
import { getAllSessionsByCourseId } from "@/db/queries/sessions";
import { Course } from "@/db/schema/course";
import { Session } from "@/db/schema/session";
import { Input } from "../ui/input";

export default function AddScore({
    closePopup,
    participantId,
    scoreId,
    courses,
}: {
    closePopup: () => void;
    participantId: number;
    scoreId?: number;
    courses: Course[] | null;
}) {
    const [instructors, setInstructors] = useState<UserNoPass[]>([]);
    const [sessions, setSessions] = useState<Session[] | null>([]);
    const [errors, setErrors] = useState({
        minutes: "",
        seconds: "",
        instructorId: "",
        sessionId: "",
        scoreId: "",
        courseId: "",
        time: "",
    });
    const [IsLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        participantId: participantId,
        scoreId: null as number | null,
        instructorId: undefined as number | undefined,
        minutes: "",
        seconds: "",
        sessionId: "",
        courseId: undefined as number | undefined,
    });

    // Fetch instructors
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch("/api/admin/instructor");
                const data = await response.json();
                setInstructors(data);
            } catch (error) {
                console.error("Error fetching instructors:", error);
                setInstructors([]);
            }
        };

        fetchInstructors();
    }, []);

    // Fetch sessions when a course is selected
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                if (!formData.courseId) return;

                const courseIds = courses?.map((course) => course.id);

                if (!courseIds) return;

                const sessionsData = await Promise.all(
                    courseIds.map((courseId) =>
                        getAllSessionsByCourseId(courseId)
                    )
                );

                const allSessions = sessionsData.flat();

                setSessions(allSessions);
            } catch (error) {
                console.error("Error fetching sessions", error);
                setSessions([]);
            }
        };

        fetchSessions();
    }, [formData.courseId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        const numericValue = value ? parseInt(value) : undefined;
        setFormData({
            ...formData,
            [name]: numericValue,
        });
    };

    const validateForm = () => {
        let isValid = true;
        const errorMessages: {
            instructorId?: string;
            sessionId?: string;
            courseId?: string;
            scoreId?: string;
            time?: string;
        } = {};

        if (!formData.instructorId) {
            errorMessages.instructorId = "Instructor is required";
            isValid = false;
        }

        if (!formData.sessionId) {
            errorMessages.sessionId = "Session is required";
            isValid = false;
        }

        if (!formData.courseId) {
            errorMessages.courseId = "Course is required";
            isValid = false;
        }

        // Show error only if both minutes and seconds are not entered
        if (!formData.minutes && !formData.seconds) {
            errorMessages.time = "Time is required";
            isValid = false;
        }

        setErrors({
            ...errors,
            ...errorMessages,
        });

        return isValid;
    };

    const handleAddScoreSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        const minutes =
            formData.minutes === "" ? 0 : parseInt(formData.minutes);
        const seconds =
            formData.seconds === "" ? 0 : parseInt(formData.seconds);
        const totalSeconds = minutes * 60 + seconds;

        const updatedFormData = {
            participantId: formData.participantId,
            instructorId: formData.instructorId!,
            sessionId: formData.sessionId,
            courseId: formData.courseId!,
            time: totalSeconds,
        };

        try {
            const response = await fetch("/api/participants/scores/create", {
                method: "POST",
                body: JSON.stringify(updatedFormData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            closePopup();
        } catch (error) {
            console.error("Error submitting score:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();

        setErrors({
            time: "",
            instructorId: "",
            scoreId: "",
            sessionId: "",
            courseId: "",
            minutes: "",
            seconds: "",
        });
        closePopup();
    };

    return (
        <div className="flex flex-col gap-12 overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                Add Board Game Score
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                method="POST"
                onSubmit={handleAddScoreSubmit}
            >
                <input type="hidden" value={participantId} />
                {errors.time && (
                    <p className="text-red-500 text-sm">{errors.time}</p>
                )}
                <div className="w-full flex flex-row gap-4 items-center">
                    <label className="flex flex-col w-1/2">
                        <span className="text-lg">Minutes</span>
                        <Input
                            type="number"
                            name="minutes"
                            min="0"
                            placeholder="0"
                            value={formData.minutes}
                            onChange={handleChange}
                            className="border rounded-lg text-center"
                        />
                    </label>
                    <span className="mt-6 text-3xl">:</span>
                    <label className="flex flex-col w-1/2">
                        <span className="text-lg">Seconds</span>
                        <Input
                            type="number"
                            name="seconds"
                            min="0"
                            max="59"
                            placeholder="0"
                            value={formData.seconds}
                            onChange={handleChange}
                            className="border rounded-lg text-center"
                        />
                    </label>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="instructorId">Instructor</label>
                    {errors.instructorId && (
                        <p className="text-red-500 text-sm">
                            {errors.instructorId}
                        </p>
                    )}
                    <Select
                        value={formData.instructorId?.toString()}
                        onValueChange={(value) =>
                            handleSelectChange("instructorId", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Instructor" />
                        </SelectTrigger>
                        <SelectContent>
                            {instructors.map((instructor) => (
                                <SelectItem
                                    key={instructor.id}
                                    value={String(instructor.id)}
                                >
                                    {instructor.firstName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="courseId">Course</label>
                    {errors.courseId && (
                        <p className="text-red-500 text-sm">
                            {errors.courseId}
                        </p>
                    )}
                    <Select
                        value={formData.courseId?.toString()}
                        onValueChange={(value) =>
                            handleSelectChange("courseId", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                            {courses?.map((course) => (
                                <SelectItem
                                    key={course.id}
                                    value={String(course.id)}
                                >
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {courses && sessions && (
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="sessionId">Session</label>
                        {errors.sessionId && (
                            <p className="text-red-500 text-sm">
                                {errors.sessionId}
                            </p>
                        )}
                        <Select
                            value={formData.sessionId.toString()}
                            onValueChange={(value) =>
                                handleSelectChange("sessionId", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Session" />
                            </SelectTrigger>
                            <SelectContent>
                                {sessions?.map((session) => (
                                    <SelectItem
                                        key={session.id}
                                        value={String(session.id)}
                                    >
                                        {session.date.toLocaleDateString(
                                            "en-US",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="flex flex-row gap-4 justify-center mt-8">
                    <Button
                        type="submit"
                        className={`${
                            IsLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4"
                        } `}
                    >
                        {IsLoading ? "Adding..." : "Add"}
                    </Button>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold md:text-xl py-2 md:py-4"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
