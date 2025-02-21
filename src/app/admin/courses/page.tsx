"use client";
import AddCourse from "@/components/courses/add-course";
import CourseCard from "@/components/courses/course-card";
import CloseIcon from "@/components/icons/close-icon";
import { fetchCourseImage, getAllCourses } from "@/db/queries/courses";
import { type Course } from "@/db/schema/course";
import { useEffect, useState } from "react";

export type CourseWithImage = Course & {
    imageUrl?: string | null;
};

export default function Courses() {
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editCourseId, setEditCourseId] = useState(-1);

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
    };
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState<CourseWithImage[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const allCourses = await getAllCourses();
                const coursesWithImages = await Promise.all(
                    allCourses.map(async (course) => {
                        const imageUrl =
                            course.uploadId !== null
                                ? await fetchCourseImage(course.uploadId)
                                : null;
                        return { ...course, imageUrl };
                    })
                );
                setCourses(coursesWithImages);
            } catch (error) {
                console.error("Error fetching courses", error);
                setCourses([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="w-full min-h-screen">
            <h1 className="font-semibold text-4xl text-center mb-6">Courses</h1>
            {showAddPopup && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-20">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <div className="relative w-full">
                            <div className="flex justify-center items-center relative p-6">
                                <div className="w-1/3 md:hidden border-b-2 border-black"></div>
                                <button
                                    onClick={handleClosePopup}
                                    className="absolute top-3 right-4"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
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
                            <div className="flex justify-center items-center relative p-6">
                                <div className="w-1/3 md:hidden border-b-2 border-black"></div>
                                <button
                                    onClick={handleClosePopup}
                                    className="absolute top-3 right-4"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
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

            <button
                className="absolute bottom-20 right-6 md:bottom-8 md:right-8 flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center z-10"
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
                                key={course.id}
                                id={course.id}
                                name={course.title}
                                image={course.imageUrl || "/course-image.png"}
                                imageAlt={`${course.title} Cover Image`}
                                description={course.description}
                                variant="admin"
                                handleEditButtonClick={handleEditButtonClick}
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
