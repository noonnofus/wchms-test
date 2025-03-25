"use client";

import CloseIcon from "@/components/icons/close-icon";
import CloseSwipe from "@/components/icons/close-swipe";
import AddSession from "@/components/sessions/add-session";
import SessionCard from "@/components/sessions/session-card";
import AddButton from "@/components/shared/add-button";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import { getAllSessionsByCourseId } from "@/db/queries/sessions";
import { Session } from "@/db/schema/session";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";

export default function SessionsPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const courseId = Number(id);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(0);
    const [sessionIdToDelete, setSessionIdToDelete] = useState<number | null>(
        null
    );
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditSessionPopup, setShowEditSessionPopup] = useState(false);
    const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);

    useEffect(() => {
        async function fetchSessions() {
            try {
                const fetchedSessions =
                    await getAllSessionsByCourseId(courseId);
                setSessions(fetchedSessions);
            } catch (error) {
                console.error("Failed to fetch sessions:", error);
            }
        }
        fetchSessions();
    }, [courseId, refreshFlag]);

    const handleEditSessionButtonClick = (session: Session) => {
        setSessionToEdit(session);
        setShowEditSessionPopup(true);
    };

    const handleDeleteSessionButtonClick = (sessionId: number) => {
        setSessionIdToDelete(sessionId);
        setShowDeletePopup(true);
    };

    const handleDeleteSession = async (e: React.FormEvent) => {
        if (!sessionIdToDelete) return;
        try {
            e.preventDefault();
            const response = await fetch("/api/sessions/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: sessionIdToDelete }),
            });

            if (!response.ok) throw new Error("Failed to delete session");

            setSessions((prev) =>
                prev.filter((session) => session.id !== sessionIdToDelete)
            );
            setSessionIdToDelete(null);
            setShowDeletePopup(false);
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
        setRefreshFlag((prev) => prev + 1);
        setSessionIdToDelete(null);
        setShowDeletePopup(false);
        setSessionToEdit(null);
        setShowEditSessionPopup(false);
    };

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
    });

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <h1 className="font-semibold text-3xl md:text-4xl text-start">
                {t("all sessions")}
            </h1>

            <div className="flex flex-col items-center gap-4">
                {sessions.length > 0 ? (
                    sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            handleDeleteButtonClick={
                                handleDeleteSessionButtonClick
                            }
                            handleEditButtonClick={handleEditSessionButtonClick}
                            isAdmin={true}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">{t("no sessions")}</p>
                )}
            </div>

            {sessionToEdit && showEditSessionPopup && (
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
                                onClick={handleClosePopup}
                                className="absolute top-3 right-4"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                            <AddSession
                                courseId={sessionToEdit.courseId}
                                sessionId={sessionToEdit.id}
                                handleClosePopup={handleClosePopup}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showDeletePopup && sessionIdToDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title={t("delete session")}
                            body={t("delete session confirmation")}
                            actionLabel={t("delete")}
                            handleSubmit={handleDeleteSession}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}

            {showAddPopup && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <div className="relative w-full">
                            <div
                                className="flex justify-center items-center p-6 md:hidden"
                                {...swipeHandlers}
                            >
                                {/* Swipe indicator */}
                                <div className="absolute top-6 md:hidden">
                                    <CloseSwipe />
                                </div>
                            </div>
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-3 right-4"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                            <AddSession
                                handleClosePopup={handleClosePopup}
                                courseId={courseId}
                            />
                        </div>
                    </div>
                </div>
            )}
            <AddButton handleAddButtonClick={() => setShowAddPopup(true)} />
        </div>
    );
}
