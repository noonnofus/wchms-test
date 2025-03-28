"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserCourses } from "@/db/queries/courses";
import {
    getAllScoresByParticipantId,
    getParticipantById,
} from "@/db/queries/participants";
import DeleteIcon from "@/components/icons/delete-icon";
import EditIcon from "@/components/icons/edit-icon";
import { Participant } from "@/db/schema/participants";
import { Course } from "@/db/schema/course";
import EditParticipant from "@/components/manage/edit-participant";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CloseSwipe from "@/components/icons/close-swipe";
import CloseIcon from "@/components/icons/close-icon";
import { useSwipeable } from "react-swipeable";
import { Score } from "@/db/schema/score";
import ScoreList from "@/components/scores/scores-list";
import { useTranslation } from "react-i18next";

export default function Profile() {
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [courses, setCourses] = useState<Course[] | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [participantId, setParticipantId] = useState<string | null>(null);
    const [scores, setScores] = useState<Score[] | null>(null);
    const router = useRouter();
    const { t } = useTranslation();

    const fetchData = async (id: string) => {
        try {
            const participantData = await getParticipantById(parseInt(id));
            setParticipant(participantData);

            const fetchedCourses = await getUserCourses(parseInt(id));
            const filteredCourses = fetchedCourses.map((course) => {
                return course.courses;
            });

            setCourses(filteredCourses);

            const fetchedScores = await getAllScoresByParticipantId(
                parseInt(id)
            );
            setScores(fetchedScores);
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

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    if (!participantId && !isLoading) {
        return (
            <div className="flex flex-col gap-4 items-center">
                <p className="font-semibold text-xl">No profile found</p>
                <Button
                    variant="outline"
                    className="w-full h-[45px] rounded-full bg-primary-green text-white hover:bg-[#045B47] hover:text-white font-semibold text-base md:text-xl py-4"
                >
                    <Link href={"/admin/manage/participants"}>
                        Back to Manage
                    </Link>
                </Button>
            </div>
        );
    }

    const handleDelete = async () => {
        if (!participant) return;

        try {
            const response = await fetch("/api/participants/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participantId: participant.id }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete participant");
            }

            sessionStorage.removeItem("participantId");
            router.replace("/admin/manage/participants");
        } catch (error) {
            console.error("Failed to delete participant", error);
        } finally {
            setShowDeletePopup(false);
        }
    };

    const calculateAge = (dob: Date) => {
        const today = new Date();
        const birthDate = new Date(dob);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };

    if (!participant) return;
    const age = calculateAge(participant.dateOfBirth);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <p>{t("loading.profile")}</p>
            </div>
        );
    }

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setShowEditPopup(false);
    };

    return (
        <main className="flex flex-col gap-6 w-full items-center h-full">
            {/* Profile Content */}
            <div className="relative flex flex-col w-full h-full items-center gap-4">
                <h1 className="font-semibold text-2xl md:text-4xl">
                    <span className="capitalize">
                        {t("users profile", {
                            firstName: participant.firstName,
                            lastName: participant.lastName,
                        })}
                    </span>
                </h1>
                <div className="absolute right-0 top-2 flex gap-2">
                    <button onClick={() => setShowDeletePopup(true)}>
                        <DeleteIcon />
                    </button>
                    <button onClick={() => setShowEditPopup(true)}>
                        <EditIcon />
                    </button>
                </div>
                <p className="text-base md:text-xl font-semibold text-[#6C757D]">
                    {t("participant")}
                </p>

                <div className="flex w-24 h-24 md:w-40 md:h-40 text-2l md:text-3xl rounded-full bg-gray-200 items-center justify-center uppercase">
                    {`${participant?.firstName[0]}${participant?.lastName[0]}`}
                </div>
            </div>

            <div className="w-full flex flex-col gap-4 text-lg">
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">
                        {t("email address")}:
                    </p>
                    <p>{participant?.email}</p>
                </div>
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">{t("age")}:</p>
                    <p>{t("ageDisplay", { age })}</p>
                </div>
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">
                        {t("date of birth")}:
                    </p>
                    <p>
                        {participant?.dateOfBirth.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">{t("gender")}:</p>
                    <p>{t(`${participant?.gender?.toLowerCase()}`)}</p>
                </div>
                {courses?.length === 0 ? (
                    <div className="flex flex-col w-full">
                        <p className="text-lg font-semibold">Courses:</p>
                        <p>{t("no course enrolled")}</p>
                    </div>
                ) : (
                    <div className="flex flex-col w-full">
                        <p className="text-lg font-semibold">
                            {t("course", { count: 2 })}
                        </p>
                        <ul className="w-full">
                            {courses?.map((course, index) => (
                                <li key={index} className="list-disc ml-8">
                                    {course.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <ScoreList scores={scores} participant={participant} />

            {showEditPopup && participant && (
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
                        <EditParticipant
                            participantData={participant}
                            closePopup={() => setShowEditPopup(false)}
                            onParticipantUpdated={() =>
                                fetchData(participantId!)
                            }
                        />
                    </div>
                </div>
            )}

            {showDeletePopup && participant && (
                <div className="fixed inset-0 flex items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={() => setShowDeletePopup(false)}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title={t("delete participant")}
                            body={t("delete participant confirmation", {
                                firstName: participant.firstName,
                                lastName: participant.lastName,
                            })}
                            actionLabel={t("delete")}
                            handleSubmit={handleDelete}
                            closePopup={() => setShowDeletePopup(false)}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
