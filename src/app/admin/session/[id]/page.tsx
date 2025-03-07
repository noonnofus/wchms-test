"use client";

import CloseIcon from "@/components/icons/close-icon";
import CloseSwipe from "@/components/icons/close-swipe";
import AddSession from "@/components/sessions/add-session";
import SessionCard from "@/components/sessions/session-card";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import { getAllSessionsByCourseId } from "@/db/queries/sessions";
import { Session } from "@/db/schema/session";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

export default function SessionsPage() {
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

    const handleDeleteSession = async () => {
        if (!sessionIdToDelete) return;
        try {
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
                All Sessions
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
                    <p className="text-gray-500">No sessions available.</p>
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
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title="Are you sure?"
                            body="This action cannot be undone."
                            actionLabel="Delete"
                            handleSubmit={handleDeleteSession}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}

            {showAddPopup && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
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

            <button
                className="absolute bottom-24 right-6 flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center z-[1]"
                onClick={() => setShowAddPopup(true)}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16 5.33334V26.6667M26.6667 16L5.33334 16"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
}
