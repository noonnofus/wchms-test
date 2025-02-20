"use client";
import AddCourse from "@/components/courses/add-course";
import CourseCard from "@/components/courses/course-card";
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
    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
    };
    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };
    const handleClosePopup = () => {
        setShowAddPopup(false);
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
        <div className="w-full h-full">
            <h1 className="font-semibold text-4xl text-center mb-6">Courses</h1>
            {showAddPopup && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>

                    <div className="relative z-20 bg-white rounded-t-lg md:rounded-lg overflow-y-auto w-full md:mx-8 max-h-[90vh]">
                        <AddCourse handleClosePopup={handleClosePopup} />
                    </div>
                </div>
            )}

            {showEditPopup && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleCloseEditPopup}
                    />
                    <div className="relative z-20 bg-white rounded-t-lg md:rounded-lg overflow-y-auto w-full md:mx-8 max-h-[90vh]">
                        <AddCourse
                            handleClosePopup={handleCloseEditPopup}
                            courseId={editCourseId}
                        />
                    </div>
                </div>
            )}

            <button
                className="absolute bottom-24 right-6 flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center z-[1]"
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
                        <p>No courses found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
