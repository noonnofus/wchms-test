"use client";

import AddSession from "@/components/sessions/add-session";
import SessionCard from "@/components/sessions/session-card";
import { deleteSession, getAllSessionsByCourseId } from "@/db/queries/sessions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SessionsPage() {
    const { id } = useParams();
    const courseId = Number(id);
    const [sessions, setSessions] = useState<
        { id: number; date: string; startTime: string; endTime: string }[]
    >([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(0);

    useEffect(() => {
        async function fetchSessions() {
            try {
                const fetchedSessions =
                    await getAllSessionsByCourseId(courseId);
                setSessions(
                    fetchedSessions.map((session) => ({
                        id: session.id,
                        date: session.date.toISOString(),
                        startTime: session.startTime.toISOString(),
                        endTime: session.endTime.toISOString(),
                    }))
                );
            } catch (error) {
                console.error("Failed to fetch sessions:", error);
            }
        }
        fetchSessions();
    }, [courseId, refreshFlag]);

    const handleDeleteSession = async (sessionId: number) => {
        try {
            await deleteSession(sessionId);
            setRefreshFlag((prev) => prev + 1);
            setSessions((prev) =>
                prev.filter((session) => session.id !== sessionId)
            );
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
        setRefreshFlag((prev) => prev + 1);
    };

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <h2 className="text-xl font-semibold">All Sessions</h2>

            <div className="flex flex-col items-center gap-4">
                {sessions.length > 0 ? (
                    sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            date={session.date}
                            startTime={session.startTime}
                            endTime={session.endTime}
                            isAdmin={true}
                            onDelete={() => handleDeleteSession(session.id)}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No sessions available.</p>
                )}
            </div>

            {showAddPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="relative z-20 flex flex-col items-center bg-white rounded-lg overflow-y-auto w-full mx-4 max-h-[90vh]">
                        <AddSession
                            handleClosePopup={handleClosePopup}
                            courseId={courseId}
                            sessionId={0}
                        />
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
