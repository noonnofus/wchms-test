import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    getAllSessionsByCourseId,
    getSessionById,
} from "@/db/queries/sessions";
import { Course } from "@/db/schema/course";
import { Session } from "@/db/schema/session";
import { Input } from "../ui/input";
import { Score } from "@/db/schema/score";
import { User } from "@/db/schema/users";
import { useTranslation } from "react-i18next";

export type UserNoPass = Omit<User, "password">;

export default function AddScore({
    closePopup,
    participantId,
    score,
    courses,
}: {
    closePopup: () => void;
    participantId: number;
    score?: Score;
    courses: Course[] | null;
}) {
    const { t } = useTranslation();
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
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        participantId: participantId,
        scoreId: score?.id ?? null,
        instructorId: score?.instructorId ?? null,
        minutes: score?.time ? Math.floor(score.time / 60).toString() : "0",
        seconds: score?.time ? (score.time % 60).toString() : "0",
        sessionId: score?.sessionId ? score.sessionId.toString() : "",
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

    useEffect(() => {
        const fetchSessions = async () => {
            if (!formData.courseId) return;

            try {
                const sessionsData = await getAllSessionsByCourseId(
                    formData.courseId
                );
                setSessions(sessionsData);
            } catch (error) {
                console.error("Error fetching sessions", error);
                setSessions([]);
            }
        };

        fetchSessions();
    }, [formData.courseId]);

    useEffect(() => {
        const fetchSessionData = async (sessionId: string) => {
            try {
                const session = await getSessionById(parseInt(sessionId));
                if (session) {
                    setFormData((prevData) => ({
                        ...prevData,
                        courseId: session.courseId,
                    }));
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            }
        };

        if (score) {
            setFormData({
                participantId: score.participantId,
                scoreId: score.id,
                instructorId: score.instructorId,
                minutes: Math.floor(score.time / 60).toString(),
                seconds: (score.time % 60).toString(),
                sessionId: score.sessionId.toString(),
                courseId: undefined,
            });

            if (score.sessionId) {
                fetchSessionData(score.sessionId.toString());
            }
        } else if (formData.sessionId) {
            fetchSessionData(formData.sessionId);
        }
    }, [score]);

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
        if (name === "courseId") {
            setFormData((prev) => ({
                ...prev,
                courseId: numericValue,
                sessionId: "",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        }
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
            errorMessages.instructorId = t("error.missingInstructor");
            isValid = false;
        }

        if (formData.courseId && !formData.sessionId) {
            errorMessages.sessionId = t("error.missingSession");
            isValid = false;
        }

        if (!formData.courseId) {
            errorMessages.courseId = t("error.missingCourse");
            isValid = false;
        }

        // Show error only if both minutes and seconds are not entered
        if (
            (formData.minutes === "" || formData.minutes === "0") &&
            (formData.seconds === "" || formData.seconds === "0")
        ) {
            errorMessages.time = t("error.missingTime");
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
            if (!response.ok) return "Failed to add new score";
            closePopup();
        } catch (error) {
            console.error("Error submitting score:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);

        const minutes =
            formData.minutes === "" ? 0 : parseInt(formData.minutes);
        const seconds =
            formData.seconds === "" ? 0 : parseInt(formData.seconds);
        const totalSeconds = minutes * 60 + seconds;

        const updatedFormData = {
            id: formData.scoreId,
            participantId: formData.participantId,
            instructorId: formData.instructorId!,
            sessionId: formData.sessionId,
            courseId: formData.courseId!,
            time: totalSeconds,
        };

        try {
            const response = await fetch("/api/participants/scores/update", {
                method: "PUT",
                body: JSON.stringify(updatedFormData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) return "Failed to update score";
            closePopup();
        } catch (error) {
            console.error("Error updating score:", error);
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
                {score ? t("edit board game score") : t("add board game score")}
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
                    <label htmlFor="minutes" className="flex flex-col w-1/2">
                        <span>{t("time.minute", { count: 2 })}</span>
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
                    <label htmlFor="seconds" className="flex flex-col w-1/2">
                        <span>{t("time.second", { count: 2 })}</span>
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
                    <label htmlFor="instructorId">{t("instructor")}</label>
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
                            <SelectValue
                                placeholder={t("placeholder.selectInstructor")}
                            />
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
                    <label htmlFor="courseId">{t("course")}</label>
                    {errors.courseId && (
                        <p className="text-red-500 text-sm">
                            {errors.courseId}
                        </p>
                    )}
                    <Select
                        value={
                            formData.courseId
                                ? formData.courseId.toString()
                                : ""
                        }
                        onValueChange={(value) =>
                            handleSelectChange("courseId", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={t("placeholder.selectCourse")}
                            />
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
                        <label htmlFor="sessionId">{t("session")}</label>
                        {errors.sessionId && (
                            <p className="text-red-500 text-sm">
                                {errors.sessionId}
                            </p>
                        )}
                        <Select
                            value={
                                formData.sessionId
                                    ? formData.sessionId.toString()
                                    : ""
                            }
                            onValueChange={(value) =>
                                handleSelectChange("sessionId", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t("placeholder.selectSession")}
                                />
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
                    {score ? (
                        <Button
                            onClick={handleUpdate}
                            disabled={isLoading}
                            className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4"
                        >
                            {isLoading ? t("updating") : t("update")}
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4"
                        >
                            {isLoading ? t("adding") : t("add")}
                        </Button>
                    )}
                    <Button
                        type="button"
                        onClick={handleCancel}
                        variant="outline"
                        className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold md:text-xl py-2 md:py-4"
                    >
                        {t("button.cancel")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
