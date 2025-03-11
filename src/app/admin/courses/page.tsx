"use client";
import AddCourse from "@/components/courses/add-course";
import CourseCard from "@/components/courses/course-card";
import CloseIcon from "@/components/icons/close-icon";
import CloseSwipe from "@/components/icons/close-swipe";
import { getAllCourses } from "@/db/queries/courses";
import { type Course } from "@/db/schema/course";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import { useTranslation } from "react-i18next";

export type CourseWithImage = Course & {
    fileKey: string | null;
    imageUrl: string | null;
};

export default function Courses() {
    const { t } = useTranslation();
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editCourseId, setEditCourseId] = useState(-1);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [refreshCourses, setRefreshCourses] = useState(false);

    const handleEditButtonClick = (courseId: number) => {
        setEditCourseId(courseId);
        setShowEditPopup(true);
    };

    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
        setShowEditPopup(false);
        setCourseToDelete(null);
        setShowDeletePopup(false);
    };

    const handleDeleteButtonClick = (course: Course) => {
        setCourseToDelete(course);
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
                body: JSON.stringify({ courseId: courseToDelete.id }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to delete");
            setRefreshCourses(true);
        } catch (error) {
            console.error("Error deleting course: ", error);
        } finally {
            setShowDeletePopup(false);
            setCourseToDelete(null);
        }
    };

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState<CourseWithImage[]>([]);

    const fetchCourses = async () => {
        try {
            const allCourses = (await getAllCourses(true)) as CourseWithImage[];
            setCourses(allCourses);
        } catch (error) {
            console.error("Error fetching courses", error);
            setCourses([]);
        } finally {
            setIsLoading(false);
            setRefreshCourses(false);
        }
    };
    useEffect(() => {
        fetchCourses();
    }, [refreshCourses]);

    return (
        <div className="w-full h-full">
            <h1 className="font-semibold text-4xl text-center mb-6">
                {t("course", { count: 2 })}
            </h1>
            {showAddPopup && (
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
                            <AddCourse handleClosePopup={handleClosePopup} />
                        </div>
                    </div>
                </div>
            )}

            {showEditPopup && (
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
                            <AddCourse
                                handleClosePopup={handleClosePopup}
                                courseId={editCourseId}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showDeletePopup && courseToDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title="Delete Course"
                            body={`Are you sure you want to delete course "${courseToDelete.title}"? You cannot undo this action.`}
                            actionLabel="DELETE"
                            handleSubmit={handleDeleteCourse}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}

            <button
                className="absolute bottom-20 right-6 flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center z-10"
                onClick={handleAddButtonClick}
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

            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <p>Loading Courses...</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 pb-10 md:pb-12">
                    {courses.length ? (
                        courses.map((course) => (
                            <CourseCard
                                course={course}
                                key={course.id}
                                variant="admin"
                                handleEditButtonClick={handleEditButtonClick}
                                handleDeleteButtonClick={
                                    handleDeleteButtonClick
                                }
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-screen">
                            <p className="text-center text-xl mb-4">
                                No courses found. Would you like to create a new
                                course?
                            </p>
                            <button
                                onClick={handleAddButtonClick}
                                className="px-6 py-2 bg-primary-green text-white rounded-lg"
                            >
                                Create New Course
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
