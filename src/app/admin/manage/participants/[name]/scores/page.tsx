"use client";
import CloseIcon from "@/components/icons/close-icon";
import CloseSwipe from "@/components/icons/close-swipe";
import AddScore from "@/components/scores/add-score";
import ScoreCard from "@/components/scores/score-card";
import AddButton from "@/components/shared/add-button";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import { getUserCourses } from "@/db/queries/courses";
import {
    getAllScoresByParticipantId,
    getParticipantById,
} from "@/db/queries/participants";
import { getSessionById } from "@/db/queries/sessions";
import { Course } from "@/db/schema/course";
import { Participant } from "@/db/schema/participants";
import { Score } from "@/db/schema/score";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";

export default function ParticipantScores() {
    const { t } = useTranslation();
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [courses, setCourses] = useState<Course[] | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [participantId, setParticipantId] = useState<string | null>(null);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [scores, setScores] = useState<Score[]>();
    const [scoreToDelete, setScoreToDelete] = useState<Score | null>(null);
    const [course, setCourse] = useState<Course | undefined>(undefined);
    const [refreshFlag, setRefreshFlag] = useState(0);
    const [scoreToEdit, setScoreToEdit] = useState<Score | null>(null);

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!participantId) return;

            setIsLoading(true);

            try {
                const participantData = await getParticipantById(
                    parseInt(participantId)
                );
                setParticipant(participantData);

                const fetchedCourses = await getUserCourses(
                    parseInt(participantId)
                );
                const filteredCourses = fetchedCourses.map((course) => {
                    return course.courses;
                });

                setCourses(filteredCourses);
            } catch (error) {
                console.error("Error fetching participant data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [participantId]);

    useEffect(() => {
        const fetchScores = async () => {
            if (!participantId) return;
            try {
                const fetchedScores = await getAllScoresByParticipantId(
                    parseInt(participantId)
                );
                setScores(fetchedScores);
            } catch (error) {
                console.error("Error fetching scores:", error);
            }
        };

        fetchScores();
    }, [participantId, refreshFlag]);

    useEffect(() => {
        const id = sessionStorage.getItem("participantId");
        if (id) {
            setParticipantId(id);
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleClosePopup = () => {
        if (scores) {
            setRefreshFlag((prev) => prev + 1);
        }
        setShowDeletePopup(false);
        setShowEditPopup(false);
        setShowAddPopup(false);
        setScoreToDelete(null);
    };

    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };

    const handleDeleteScoreButtonClick = async (score: Score) => {
        setScoreToDelete(score);
        setShowDeletePopup(true);

        const session = await getSessionById(score.sessionId);
        const course = courses?.find((c) => c.id === session.courseId);
        setCourse(course);
    };

    const handleDelete = async (e: React.FormEvent) => {
        if (!scoreToDelete) return;

        try {
            e.preventDefault();
            const response = await fetch("/api/participants/scores/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scoreId: scoreToDelete.id }),
            });

            if (!response.ok) throw new Error("Failed to delete score");

            setScores((prev) =>
                prev?.filter((score) => score.id !== scoreToDelete.id)
            );
            setScoreToDelete(null);
            setShowDeletePopup(false);
        } catch (error) {
            console.error("Failed to delete score", error);
        }
    };

    const handleEditScoreButtonClick = (score: Score) => {
        setScoreToEdit(score);
        setShowEditPopup(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <p>{t("loading.scores")}</p>
            </div>
        );
    }

    return (
        <main className="flex flex-col gap-10 w-full items-center h-full mb-16 md:mb-32 lg:mb-52">
            <h1 className="font-semibold text-3xl md:text-4xl text-start">
                {t("all scores")}
            </h1>
            <div className="w-full flex flex-col items-center gap-4">
                {scores && scores.length > 0 ? (
                    scores.map((score) => (
                        <ScoreCard
                            key={score.id}
                            score={score}
                            handleDeleteButtonClick={
                                handleDeleteScoreButtonClick
                            }
                            handleEditButtonClick={handleEditScoreButtonClick}
                            isAdmin={true}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No scores available.</p>
                )}
            </div>

            {showAddPopup && participant && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={() => setShowEditPopup(false)}
                    ></div>
                    <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <div className="relative w-full">
                            <div
                                className="flex justify-center items-center p-6 md:hidden "
                                {...swipeHandlers}
                            >
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
                        <AddScore
                            participantId={participant.id}
                            courses={courses}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}

            {showEditPopup && participant && scoreToEdit && (
                <div className="fixed inset-0 flex items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <div className="relative w-full">
                            <div
                                className="flex justify-center items-center p-6 md:hidden "
                                {...swipeHandlers}
                            >
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
                        <AddScore
                            participantId={participant.id}
                            courses={courses}
                            closePopup={handleClosePopup}
                            score={scoreToEdit}
                        />
                    </div>
                </div>
            )}

            {showDeletePopup && participant && scoreToDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-20">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title={t("delete score")}
                            body={t("delete score confirmation", {
                                score: {
                                    timeMin: t("score.timeMin", {
                                        minutes: Math.floor(
                                            scoreToDelete.time / 60
                                        ),
                                        count: Math.floor(
                                            scoreToDelete.time / 60
                                        ),
                                    }),
                                    timeSec: t("score.timeSec", {
                                        seconds: Math.floor(
                                            scoreToDelete.time % 60
                                        ),
                                        count: Math.floor(
                                            scoreToDelete.time % 60
                                        ),
                                    }),
                                },
                                firstName: participant.firstName,
                                lastName: participant.lastName,
                                courseName: course?.title,
                            })}
                            actionLabel={t("delete")}
                            handleSubmit={handleDelete}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}

            <AddButton handleAddButtonClick={handleAddButtonClick} />
        </main>
    );
}
