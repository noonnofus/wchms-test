"use client";
import CloseIcon from "@/components/icons/close-icon";
import CloseSwipe from "@/components/icons/close-swipe";
import AddScore from "@/components/scores/add-score";
import ScoreCard from "@/components/scores/score-card";
import { getUserCourses } from "@/db/queries/courses";
import {
    getAllScoresByParticipantId,
    getParticipantById,
} from "@/db/queries/participants";
import { Course } from "@/db/schema/course";
import { Participant } from "@/db/schema/participants";
import { Score } from "@/db/schema/score";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

export default function ParticipantScores() {
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [courses, setCourses] = useState<Course[] | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [participantId, setParticipantId] = useState<string | null>(null);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [scores, setScores] = useState<Score[] | null>(null);
    const router = useRouter();
    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    const fetchData = async (id: string) => {
        try {
            const participantData = await getParticipantById(parseInt(id));
            setParticipant(participantData);

            const fetchedCourses = await getUserCourses(parseInt(id));
            const filteredCourses = fetchedCourses.map((course) => {
                const { course_participants, ...courseData } = course;
                return courseData.courses;
            });

            setCourses(filteredCourses);

            const fetchedScores = await getAllScoresByParticipantId(
                parseInt(id)
            );
            setScores(fetchedScores);
            console.log(fetchedScores);
        } catch (error) {
            console.error("Error fetching participant data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const id = sessionStorage.getItem("participantId");
            if (id) {
                setParticipantId(id);
                fetchData(id);
            } else {
                setIsLoading(false);
            }
        }
    }, []);

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setShowEditPopup(false);
        setShowAddPopup(false);
    };

    const handleDeleteScoreButtonClick = () => {};

    const handleEditScoreButtonClick = () => {};

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <p>Loading scores...</p>
            </div>
        );
    }
    return (
        <main className="flex flex-col gap-10 w-full items-center h-full">
            <h1 className="font-semibold text-3xl md:text-4xl text-start">
                All Scores
            </h1>
            <div className="md:w-[500px] flex flex-col items-center gap-4">
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
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
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
                        <AddScore
                            participantId={participant.id}
                            courses={courses}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
