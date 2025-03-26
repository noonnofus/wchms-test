"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import AddSession from "@/components/sessions/add-session";
import CloseSwipe from "@/components/icons/close-swipe";
import { useEffect, useState } from "react";
import { Session } from "@/db/schema/session";
import CloseIcon from "../icons/close-icon";
import EditIcon from "../icons/edit-icon";
import DeleteConfirmation from "../shared/delete-confirmation";
import { getAllSessionsByCourseId } from "@/db/queries/sessions";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";

export default function SessionOverviewCard({}: {}) {
    const { t } = useTranslation();
    const { id } = useParams();
    const [courseSessions, setCourseSessions] = useState<Session[]>();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<Session | null>(
        null
    );
    const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);

    useEffect(() => {
        const fetchSessions = async () => {
            if (!id) return;
            try {
                const sessions = await getAllSessionsByCourseId(Number(id));
                setCourseSessions(sessions);
            } catch (error) {
                console.error("Error fetching course sessions", error);
            }
        };
        fetchSessions();
    }, [id]);

    const handleDeleteSessionClick = (session: Session) => {
        setShowDeletePopup(true);
        setSessionToDelete(session);
    };

    const handleEditSessionClick = (session: Session) => {
        setShowEditPopup(true);
        setSessionToEdit(session);
    };

    const handleDeleteSession = async (e: React.FormEvent) => {
        if (!sessionToDelete) return;
        try {
            e.preventDefault();
            const response = await fetch("/api/sessions/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: sessionToDelete.id }),
            });

            if (!response.ok) throw new Error("Failed to delete session");

            const data = await response.json();

            if (!response.ok)
                throw new Error(
                    data.error || "Failed to delete course session."
                );
            setCourseSessions((prev) =>
                prev?.filter((r) => r.id !== sessionToDelete.id)
            );
        } catch (error) {
            console.error("Error deleting request: ", error);
        } finally {
            setShowDeletePopup(false);
            setSessionToDelete(null);
        }
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setShowEditPopup(false);
        setSessionToDelete(null);
        setSessionToEdit(null);
    };

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
    });

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
            year: "numeric",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const formatTime = (timeString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        return new Date(timeString).toLocaleTimeString("en-US", options);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <Card className="w-full max-w-none overflow-hidden">
                <CardHeader className="w-full py-4 md:py-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-left text-2xl md:text-[32px]">
                            {t("all sessions")}
                        </CardTitle>
                        <Link href={`/admin/session/${id}`}>
                            <p className="text-primary-green text-sm md:text-xl font-semibold">
                                {t("view all")}
                            </p>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="overflow-x-auto w-full h-full">
                    <div className="flex overflow-x-auto min-w-max space-x-4">
                        {courseSessions && courseSessions.length ? (
                            courseSessions.map((session) => {
                                return (
                                    <div
                                        className="flex flex-col gap-4 w-40 md:w-52 h-auto border-2 border-primary-green rounded-lg p-2 md:p-4"
                                        key={session.id}
                                    >
                                        <p className="text-lg md:text-xl font-semibold">
                                            {`${formatDate(session.date.toISOString())}`}
                                            <p className="text-lg md:text-sm font-semibold">
                                                {`${formatTime(session.startTime.toISOString())} - ${formatTime(session.endTime.toISOString())}`}
                                            </p>
                                        </p>

                                        {id && (
                                            <div className="w-full h-full flex gap-2 items-center justify-center">
                                                <Button
                                                    onClick={() =>
                                                        handleEditSessionClick(
                                                            session
                                                        )
                                                    }
                                                    className="w-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-sm md:text-base"
                                                >
                                                    <EditIcon />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        handleDeleteSessionClick(
                                                            session
                                                        )
                                                    }
                                                    className="w-full rounded-full bg-destructive-red text-destructive-text hover:bg-destructive-hover font-semibold text-sm md:text-base"
                                                >
                                                    <CloseIcon />
                                                </Button>
                                            </div>
                                        )}
                                        {showDeletePopup && sessionToDelete && (
                                            <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                                                <div
                                                    className="absolute inset-0 bg-black opacity-50"
                                                    onClick={handleClosePopup}
                                                ></div>
                                                <div className="z-30 bg-white rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                                                    <DeleteConfirmation
                                                        title={t(
                                                            "delete session"
                                                        )}
                                                        body={t(
                                                            "delete session confirmation"
                                                        )}
                                                        actionLabel={t(
                                                            "delete"
                                                        )}
                                                        handleSubmit={
                                                            handleDeleteSession
                                                        }
                                                        closePopup={
                                                            handleClosePopup
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {sessionToEdit && showEditPopup && (
                                            <div className="fixed inset-0 flex items-end md:items-center justify-center z-20 overflow-y-auto">
                                                <div
                                                    className="absolute inset-0 bg-black opacity-50"
                                                    onClick={handleClosePopup}
                                                />
                                                <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                                                    <div className="relative w-full">
                                                        <div
                                                            className="flex justify-center items-center p-6 md:hidden "
                                                            {...swipeHandlers}
                                                        >
                                                            {/* Swipe indicator */}
                                                            <div className="absolute top-6 md:hidden">
                                                                <CloseSwipe />
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={
                                                                handleClosePopup
                                                            }
                                                            className="absolute top-3 right-4"
                                                        >
                                                            <CloseIcon />
                                                        </button>
                                                    </div>
                                                    <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                                                        <AddSession
                                                            courseId={
                                                                sessionToEdit.courseId
                                                            }
                                                            sessionId={
                                                                sessionToEdit.id
                                                            }
                                                            handleClosePopup={
                                                                handleClosePopup
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p>{t("no sessions")}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
