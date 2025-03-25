"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getSessionById } from "@/db/queries/sessions";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { useTranslation } from "react-i18next";

export const statuses = ["Draft", "Available", "Completed", "Archived"];

interface Props {
    handleClosePopup: () => void;
    courseId: number;
    sessionId?: number;
}

type Instructor = {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    role: "Admin" | "Staff";
};

interface ErrorMessages {
    instructorId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    status?: string;
}

export default function AddSession(props: Props) {
    const { t } = useTranslation();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [instructors, setInstructors] = useState<Instructor[]>([]);

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
        if (props.sessionId) {
            const fetchSession = async () => {
                try {
                    if (props.sessionId !== undefined) {
                        const response = await getSessionById(props.sessionId);

                        const sessionDate = new Date(response.date);
                        const startTime = new Date(response.startTime);
                        const endTime = new Date(response.endTime);

                        setFormData({
                            sessionId: response.id,
                            courseId: response.courseId,
                            instructorId:
                                response.instructorId?.toString() || "",
                            date: sessionDate,
                            startTime: startTime.toTimeString().slice(0, 5),
                            endTime: endTime.toTimeString().slice(0, 5),
                            status: response.status,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching session data:", error);
                }
            };

            fetchSession();
        }
    }, [props.sessionId]);

    const [formData, setFormData] = useState({
        sessionId: props.sessionId || null,
        courseId: props.courseId,
        instructorId: "",
        date: null as Date | null,
        startTime: "",
        endTime: "",
        status: "Draft" as "Draft" | "Available" | "Completed" | "Archived",
    });

    const [errors, setErrors] = useState<ErrorMessages>({
        instructorId: "",
        date: "",
        startTime: "",
        endTime: "",
        status: "",
    });

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (name: string, date: Date | undefined) => {
        if (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (date < today) {
                setErrors((prev) => ({
                    ...prev,
                    date: "Session date cannot be in the past",
                }));
                return;
            }
        }

        setErrors((prev) => ({ ...prev, date: "" }));
        setFormData({
            ...formData,
            [name]: date,
        });
    };

    const validateForm = () => {
        let isValid = true;
        const errorMessages: ErrorMessages = {};
        const now = new Date();
        now.setSeconds(0, 0);

        if (!formData.instructorId) {
            errorMessages.instructorId = t("error.missingInstructor");
            isValid = false;
        }

        if (!formData.date) {
            errorMessages.date = t("error.missingDate");
            isValid = false;
        } else {
            const sessionDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (sessionDate < today) {
                errorMessages.date = t("error.invalidDatePast");
                isValid = false;
            }
        }

        if (!formData.startTime) {
            errorMessages.startTime = t("error.missingStartTime");
            isValid = false;
        }

        if (!formData.endTime) {
            errorMessages.endTime = t("error.missingEndTime");
            isValid = false;
        }

        if (formData.date && formData.startTime && formData.endTime) {
            const sessionDate = new Date(formData.date);
            const [startHours, startMinutes] = formData.startTime.split(":");
            const [endHours, endMinutes] = formData.endTime.split(":");

            const startTime = new Date(sessionDate);
            startTime.setHours(
                parseInt(startHours),
                parseInt(startMinutes),
                0,
                0
            );

            const endTime = new Date(sessionDate);
            endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

            if (
                sessionDate.toDateString() === now.toDateString() &&
                startTime.getTime() < now.getTime()
            ) {
                errorMessages.startTime = t("error.invalidStartTime");
                isValid = false;
            }

            if (endTime <= startTime) {
                errorMessages.endTime = t("error.invalidEndTime");
                isValid = false;
            }
        }

        if (!statuses.includes(formData.status)) {
            errorMessages.status = t("error.invalidStatus");
            isValid = false;
        }

        setErrors(errorMessages);
        return isValid;
    };

    const prepareSubmitData = () => {
        if (!formData.date) return null;

        const date = new Date(formData.date);
        const [startHours, startMinutes] = formData.startTime.split(":");
        const [endHours, endMinutes] = formData.endTime.split(":");

        const startTime = new Date(date);
        startTime.setHours(parseInt(startHours), parseInt(startMinutes));

        const endTime = new Date(date);
        endTime.setHours(parseInt(endHours), parseInt(endMinutes));

        return {
            sessionId: formData.sessionId,
            courseId: formData.courseId,
            instructorId: parseInt(formData.instructorId),
            date: date.toISOString(),
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            status: formData.status,
        };
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData = prepareSubmitData();
        if (!submitData) {
            setErrors((prev) => ({ ...prev, date: t("error.invalidDate") }));
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/sessions/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create session");
            }
            console.log("Session created successfully");
            props.handleClosePopup();
            router.refresh();
        } catch (error) {
            console.error("Error:", error);
            setErrors((prev) => ({
                ...prev,
                form:
                    error instanceof Error
                        ? error.message
                        : "Failed to create session",
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData = prepareSubmitData();
        if (!submitData) {
            setErrors((prev) => ({ ...prev, date: t("error.invalidDate") }));
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/sessions/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update session");
            }

            console.log("Session updated successfully");
            props.handleClosePopup();
            router.refresh();
        } catch (error) {
            console.error("Error:", error);
            setErrors((prev) => ({
                ...prev,
                form:
                    error instanceof Error
                        ? error.message
                        : "Failed to update session",
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-12 w-full h-full py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                {props.sessionId ? t("edit session") : t("add session")}
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="instructorId">{t("instructor")}</label>
                    {errors.instructorId && (
                        <p className="text-red-500 text-sm">
                            {errors.instructorId}
                        </p>
                    )}
                    <Select
                        value={formData.instructorId}
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
                    <label htmlFor="date">{t("session date")}</label>
                    {errors.date && (
                        <p className="text-red-500 text-sm">{errors.date}</p>
                    )}
                    <DatePicker
                        selected={formData.date}
                        onChange={(date) => handleDateChange("date", date)}
                    />
                </div>

                <div className="w-full flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="startTime">{t("session start")}</label>
                        {errors.startTime && (
                            <p className="text-red-500 text-sm">
                                {errors.startTime}
                            </p>
                        )}
                        <Select
                            value={formData.startTime}
                            onValueChange={(value) =>
                                handleSelectChange("startTime", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <SelectValue
                                        placeholder={t(
                                            "placeholder.selectStartTime"
                                        )}
                                    />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 48 }, (_, i) => {
                                    const hour = Math.floor(i / 2);
                                    const minute = i % 2 === 0 ? "00" : "30";
                                    const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                                    return (
                                        <SelectItem key={time} value={time}>
                                            {time}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="endTime">{t("session end")}</label>
                        {errors.endTime && (
                            <p className="text-red-500 text-sm">
                                {errors.endTime}
                            </p>
                        )}
                        <Select
                            value={formData.endTime}
                            onValueChange={(value) =>
                                handleSelectChange("endTime", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <SelectValue
                                        placeholder={t(
                                            "placeholder.selectEndTime"
                                        )}
                                    />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 48 }, (_, i) => {
                                    const hour = Math.floor(i / 2);
                                    const minute = i % 2 === 0 ? "00" : "30";
                                    const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                                    return (
                                        <SelectItem key={time} value={time}>
                                            {time}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="status">{t("status")}</label>
                    {errors.status && (
                        <p className="text-red-500 text-sm">{errors.status}</p>
                    )}
                    <Select
                        value={formData.status}
                        onValueChange={(value) =>
                            handleSelectChange("status", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={t("placeholder.selectStatus")}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {t(`${status.toLowerCase()}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full flex flex-row gap-2 mt-4">
                    {props.sessionId ? (
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
                        onClick={props.handleClosePopup}
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
