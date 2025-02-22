"use client";
import { useParams } from "next/navigation";
import TabsMenu from "@/components/shared/tabs-menu";
import CourseDetailsCard from "@/components/courses/course-details-card";
import MaterialCard from "@/components/shared/material-card";
import { useEffect, useState } from "react";
import ParticipantList from "@/components/courses/participant-list";
import AddMaterial from "@/components/courses/add-material";
import EditMaterial from "@/components/courses/edit-material";
import { getCourseById } from "@/db/queries/courses";
import AddCourse from "@/components/courses/add-course";
import { Button } from "@/components/ui/button";
import CloseIcon from "@/components/icons/close-icon";
import { CourseMaterialsWithFile } from "@/db/schema/courseMaterials";
import { CourseFull } from "@/db/schema/course";

export default function AdminCourses() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<
        CourseFull | undefined
    >(undefined); //TODO: update type, include materials and participant types
    const [unaddedParticipants, setUnaddedParticipants] = useState<string[]>(
        []
    );
    const [showUnaddedOverlay, setShowUnaddedOverlay] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditMaterialPopup, setShowEditMaterialPopup] = useState(false);
    const [editMaterialId, setMaterialId] = useState("");
    const [showEditCoursePopup, setShowEditCoursePopup] = useState(false);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const course = await getCourseById(
                    parseInt(id as string),
                    false,
                    true
                );
                //TODO: update to be dynamic class materials and dynamic participants
                if (course) {
                    setSelectedCourse({
                        ...course,
                        participants: [
                            {
                                id: "1",
                                firstName: "Annabelle",
                                lastName: "Chen",
                                city: "Vancouver",
                            },
                            {
                                id: "2",
                                firstName: "Kevin",
                                lastName: "So",
                                city: "Vancouver",
                            },
                            {
                                id: "3",
                                firstName: "Armaan",
                                lastName: "Brar",
                                city: "Surrey",
                            },
                            {
                                id: "4",
                                firstName: "Angus",
                                lastName: "Ng",
                                city: "Vancouver",
                            },
                        ],
                    });
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

    if (!selectedCourse) {
        return <div>No course found</div>;
    }

    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };
    const handleClosePopup = () => {
        setShowAddPopup(false);
    };
    const handleEditButtonClick = (id: string) => {
        setMaterialId(id);
        setShowEditMaterialPopup(true);
    };
    const handleCloseEditPopup = () => {
        setMaterialId("");
        setShowEditMaterialPopup(false);
    };

    const handleEditCourseButtonClick = () => {
        setShowEditCoursePopup(true);
    };
    const handleCloseEditCoursePopup = () => {
        setShowEditCoursePopup(false);
    };

    return (
        <div className="w-full h-full">
            <TabsMenu
                tabsListClassName="z-[1]"
                leftLabel="Course Home"
                rightLabel="Course Materials"
                leftChildren={
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Courses...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <CourseDetailsCard
                                    name={selectedCourse.title}
                                    description={
                                        selectedCourse?.description || ""
                                    }
                                    variant="admin"
                                    editAction={handleEditCourseButtonClick}
                                />
                                <ParticipantList
                                    participants={
                                        selectedCourse.participants || []
                                    }
                                />
                            </div>
                        )}
                        {showEditCoursePopup && (
                            <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
                                <div
                                    className="absolute inset-0 bg-black opacity-50"
                                    onClick={handleCloseEditCoursePopup}
                                ></div>
                                <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                                    <div className="relative w-full">
                                        <div className="flex justify-center items-center relative p-6">
                                            <div className="w-1/3 md:hidden border-b-2 border-black"></div>
                                            <button
                                                onClick={
                                                    handleCloseEditCoursePopup
                                                }
                                                className="absolute top-3 right-4"
                                            >
                                                <CloseIcon />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                                        <AddCourse
                                            handleClosePopup={
                                                handleCloseEditCoursePopup
                                            }
                                            courseId={parseInt(id as string)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                }
                rightChildren={
                    <div className="w-full">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Courses...</p>
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
                                                />
                                            );
                                        }
                                    )
                                ) : (
                                    <div className="flex flex-col justify-center items-center py-10 gap-6">
                                        <p className="text-center text-xl md:text-2xl font-semibold">
                                            No materials available for this
                                            course.
                                        </p>
                                        <p className="text-center md:text-xl">
                                            Would you like to create new course
                                            material?
                                        </p>
                                        <button
                                            onClick={handleAddButtonClick}
                                            className="px-6 py-2 bg-primary-green text-white rounded-lg"
                                        >
                                            Create New Course Material
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={handleAddButtonClick}
                                    className="absolute bottom-24 right-2 md:bottom-24 md:right-6 flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center z-[1]"
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
                                {showAddPopup && (
                                    <div className="fixed inset-0 flex items-end md:items-center justify-center z-10">
                                        <div
                                            className="absolute inset-0 bg-black opacity-50"
                                            onClick={handleClosePopup}
                                        ></div>
                                        <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                                            <div className="relative w-full">
                                                <div className="flex justify-center items-center relative pt-6">
                                                    <div className="w-1/3 md:hidden border-b-2 border-black"></div>
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
                                    <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
                                        <div
                                            className="absolute inset-0 bg-black opacity-50"
                                            onClick={handleCloseEditPopup}
                                        ></div>
                                        <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                                            <div className="relative w-full">
                                                <div className="flex justify-center items-center relative pt-6">
                                                    <div className="w-1/3 md:hidden border-b-2 border-black"></div>
                                                    <button
                                                        onClick={
                                                            handleCloseEditPopup
                                                        }
                                                        className="absolute top-3 right-4"
                                                    >
                                                        <CloseIcon />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                                                {selectedCourse?.materials && (
                                                    <EditMaterial
                                                        handleClosePopup={
                                                            handleCloseEditPopup
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
