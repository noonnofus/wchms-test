"use client";
import AddCourse from "@/components/courses/add-course";
import AddMaterial from "@/components/courses/add-material";
import CourseDetailsCard from "@/components/courses/course-details-card";
import EditMaterial from "@/components/courses/edit-material";
import ParticipantList from "@/components/courses/participant-list";
import RequestList from "@/components/courses/request-list";
import CloseIcon from "@/components/icons/close-icon";
import CloseSwipe from "@/components/icons/close-swipe";
import AddButton from "@/components/shared/add-button";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import MaterialCard from "@/components/shared/material-card";
import TabsMenu from "@/components/shared/tabs-menu";
import { Button } from "@/components/ui/button";
import { getAllCourseJoinRequests, getCourseById } from "@/db/queries/courses";
import { Course, CourseFull } from "@/db/schema/course";
import { CourseJoinRequest } from "@/db/schema/courseJoinRequests";
import {
    CourseMaterialsWithFile,
    type CourseMaterials,
} from "@/db/schema/courseMaterials";
import { Participant } from "@/db/schema/participants";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSwipeable } from "react-swipeable";

export default function AdminCourses() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [selectedCourse, setSelectedCourse] = useState<
        CourseFull | undefined
    >(undefined);
    const [unaddedParticipants, setUnaddedParticipants] = useState<string[]>(
        []
    );
    const [showUnaddedOverlay, setShowUnaddedOverlay] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditMaterialPopup, setShowEditMaterialPopup] = useState(false);
    const [editMaterialId, setEditMaterialId] = useState("");
    const [showEditCoursePopup, setShowEditCoursePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [materialToDelete, setMaterialToDelete] =
        useState<CourseMaterials | null>(null);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
    const [requests, setRequests] = useState<CourseJoinRequest[] | null>(null);
    const [participants, setParticipants] = useState<Participant[]>(
        selectedCourse?.participants || []
    );

    const removeParticipantLocally = (userId: number) => {
        setParticipants((prev) => prev?.filter((p) => p.id !== userId));
    };

    const approveParticipantJoinLocally = (participant: Participant) => {
        setParticipants((prev) => [...prev, participant]);
    };

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const course = await getCourseById(
                    parseInt(id as string),
                    false,
                    true,
                    true
                );
                if (course) {
                    setSelectedCourse(course);
                }
                if (course?.participants) {
                    setParticipants(course.participants);
                }
            } catch (error) {
                console.error("Error fetching courses", error);
                setSelectedCourse(undefined);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, [id]);

    useEffect(() => {
        const storedData = sessionStorage.getItem("unaddedParticipants");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
                setUnaddedParticipants(parsedData);
                setShowUnaddedOverlay(true);
                sessionStorage.setItem("unaddedParticipants", "");
            }
        }
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchJoinRequests = async () => {
            try {
                const requests = await getAllCourseJoinRequests(
                    parseInt(id as string)
                );
                if (requests) {
                    setRequests(requests);
                }
            } catch (error) {
                console.error("Error fetching join requests", error);
                setRequests(null);
            }
        };
        fetchJoinRequests();
    }, [id]);

    if (!selectedCourse) {
        return <div>{t("no course found")}</div>;
    }

    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };

    const handleEditCourseButtonClick = () => {
        setShowEditCoursePopup(true);
    };

    const handleDeleteCourseButtonClick = () => {
        setCourseToDelete(selectedCourse);
        setShowDeletePopup(true);
    };

    const handleDeleteCourse = async (e: React.FormEvent) => {
        if (!courseToDelete) return;
        try {
            e.preventDefault();
            const response = await fetch("/api/courses/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ courseId: selectedCourse.id }),
            });

            const data = await response.json();
            router.push("/admin/courses/");

            if (!response.ok) throw new Error(data.error || "Failed to delete");
        } catch (error) {
            console.error("Error deleting course: ", error);
        } finally {
            setShowDeletePopup(false);
            setCourseToDelete(null);
        }
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
        setShowEditCoursePopup(false);
        setShowDeletePopup(false);
        setEditMaterialId("");
        setShowEditMaterialPopup(false);
    };
    const handleEditButtonClick = (id: string) => {
        setEditMaterialId(id);
        setShowEditMaterialPopup(true);
    };

    const handleMaterialDeleteButtonClick = (
        courseMaterial: CourseMaterials
    ) => {
        setMaterialToDelete(courseMaterial);
        setShowDeletePopup(true);
    };

    const handleDeleteCourseMaterial = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!materialToDelete) return;

        try {
            const response = await fetch("/api/courses/materials/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ courseMaterialId: materialToDelete.id }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to delete");

            if (selectedCourse) {
                setSelectedCourse({
                    ...selectedCourse,
                    materials: selectedCourse.materials?.filter(
                        (material) => material.id !== materialToDelete.id
                    ),
                });
            }
            setShowDeletePopup(false);
            setMaterialToDelete(null);
        } catch (error) {
            console.error("Error deleting course material:", error);
        }
    };

    return (
        <div className="w-full h-full">
            <TabsMenu
                tabsListClassName="z-[1]"
                leftLabel={t("course home")}
                rightLabel={t("course materials")}
                leftChildren={
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>{t("loading.courses")}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6 md:gap-8">
                                <CourseDetailsCard
                                    course={selectedCourse}
                                    variant="admin"
                                    editAction={handleEditCourseButtonClick}
                                    handleDeleteButtonClick={
                                        handleDeleteCourseButtonClick
                                    }
                                />
                                <Button
                                    className="bg-primary-green text-white rounded-full w-full font-semibold text-base hover:bg-[#045B47]"
                                    onClick={() =>
                                        router.push(`/admin/session/${id}`)
                                    }
                                >
                                    {t("all sessions")}
                                </Button>
                                {requests ? (
                                    <RequestList
                                        requests={requests}
                                        approveParticipantJoinLocally={
                                            approveParticipantJoinLocally
                                        }
                                    />
                                ) : null}
                                <ParticipantList
                                    participants={participants}
                                    courseId={parseInt(id as string)}
                                    removeParticipantLocally={
                                        removeParticipantLocally
                                    }
                                />
                            </div>
                        )}

                        {showEditCoursePopup && (
                            <div className="fixed inset-0 flex items-end md:items-center justify-center z-20">
                                <div
                                    className="absolute inset-0 bg-black opacity-50"
                                    onClick={handleClosePopup}
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
                                    <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                                        <AddCourse
                                            handleClosePopup={handleClosePopup}
                                            courseId={parseInt(id as string)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {showDeletePopup && courseToDelete && (
                            <div className="fixed inset-0 flex items-center justify-center z-20">
                                <div
                                    className="absolute inset-0 bg-black opacity-50"
                                    onClick={handleClosePopup}
                                ></div>
                                <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                                    <DeleteConfirmation
                                        title={t("delete course")}
                                        body={t("delete course confirmation", {
                                            courseTitle: courseToDelete.title,
                                        })}
                                        actionLabel={t("delete")}
                                        handleSubmit={handleDeleteCourse}
                                        closePopup={handleClosePopup}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                }
                rightChildren={
                    <div className="w-full mb-8">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>{t("loading.courses")}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {selectedCourse.materials?.length ? (
                                    selectedCourse.materials.map(
                                        (material: CourseMaterialsWithFile) => {
                                            return (
                                                <MaterialCard
                                                    key={
                                                        material.id +
                                                        material.title
                                                    }
                                                    material={material}
                                                    handleEditButtonClick={() =>
                                                        handleEditButtonClick(
                                                            material.id.toString()
                                                        )
                                                    }
                                                    handleDeleteButtonClick={() =>
                                                        handleMaterialDeleteButtonClick(
                                                            material
                                                        )
                                                    }
                                                />
                                            );
                                        }
                                    )
                                ) : (
                                    <div className="flex flex-col justify-center items-center py-10 gap-6">
                                        <p className="text-center text-xl md:text-2xl font-semibold">
                                            {t("no materials available")}
                                        </p>
                                        <p className="text-center md:text-xl">
                                            {t("new materials prompt")}
                                        </p>
                                        <button
                                            onClick={handleAddButtonClick}
                                            className="px-6 py-2 bg-primary-green text-white rounded-lg"
                                        >
                                            {t("create course materials")}
                                        </button>
                                    </div>
                                )}
                                <AddButton
                                    handleAddButtonClick={handleAddButtonClick}
                                />
                                {showAddPopup && (
                                    <div className="fixed inset-0 flex items-end md:items-center justify-center z-20">
                                        <div
                                            className="absolute inset-0 bg-black opacity-50"
                                            onClick={handleClosePopup}
                                        ></div>
                                        <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                                            <div className="relative w-full">
                                                <div
                                                    className="flex justify-center items-center p-6 "
                                                    {...swipeHandlers}
                                                >
                                                    {/* Swipe indicator */}
                                                    <div className="absolute top-6 md:hidden">
                                                        <CloseSwipe />
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
                                            </div>
                                            <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                                                <AddMaterial
                                                    handleClosePopup={
                                                        handleClosePopup
                                                    }
                                                    setSelectedCourse={
                                                        setSelectedCourse
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showEditMaterialPopup && (
                                    <div className="fixed inset-0 flex items-end md:items-center justify-center z-20 overflow-y-auto">
                                        <div
                                            className="absolute inset-0 bg-black opacity-50"
                                            onClick={handleClosePopup}
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
                                            <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                                                {selectedCourse?.materials && (
                                                    <EditMaterial
                                                        handleClosePopup={
                                                            handleClosePopup
                                                        }
                                                        material={
                                                            selectedCourse?.materials?.filter(
                                                                (
                                                                    material: CourseMaterialsWithFile
                                                                ) =>
                                                                    material.id.toString() ===
                                                                    editMaterialId
                                                            )[0]
                                                        }
                                                        setSelectedCourse={
                                                            setSelectedCourse
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showDeletePopup && materialToDelete && (
                                    <div className="fixed inset-0 flex items-center justify-center z-20">
                                        <div
                                            className="absolute inset-0 bg-black opacity-50"
                                            onClick={handleClosePopup}
                                        ></div>
                                        <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                                            <DeleteConfirmation
                                                title={t(
                                                    "delete course material"
                                                )}
                                                body={t(
                                                    "delete course material confirmation",
                                                    {
                                                        materialTitle:
                                                            materialToDelete.title,
                                                    }
                                                )}
                                                actionLabel={t("delete")}
                                                handleSubmit={
                                                    handleDeleteCourseMaterial
                                                }
                                                closePopup={handleClosePopup}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                }
            />
            {showUnaddedOverlay && (
                <div className="absolute z-[1] inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 flex flex-col gap-6">
                        <h1 className="font-semibold text-2xl md:text-3xl text-center">
                            Participants Not Added
                        </h1>
                        <p>Invalid Participant Names:</p>
                        <ul className="list-disc list-inside text-gray-700 text-lg">
                            {unaddedParticipants.map((name, index) => (
                                <li key={index} className="py-1">
                                    {name}
                                </li>
                            ))}
                        </ul>
                        <div className="w-full flex justify-center">
                            <Button
                                onClick={() => setShowUnaddedOverlay(false)}
                                className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-3"
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
