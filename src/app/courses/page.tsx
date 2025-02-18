"use client";
import CourseCard from "@/components/courses/course-card";
import TabsMenu from "@/components/shared/tabs-menu";
import {
    courseList,
    fetchCourseImage,
    getAvailableCourses,
} from "@/db/queries/courses";
import { useEffect, useState } from "react";

export type CourseListWithImage = courseList & {
    imageUrl?: string | null;
};

export default function Courses() {
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState<{
        enrolled: CourseListWithImage[];
        unenrolled: CourseListWithImage[];
    }>({
        enrolled: [] as CourseListWithImage[],
        unenrolled: [] as CourseListWithImage[],
    });
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const availableCourses = await getAvailableCourses();
                const enrolledCourses = await Promise.all(
                    availableCourses.enrolled.map(async (course) => {
                        const imageUrl = course.id
                            ? await fetchCourseImage(course.id)
                            : "/course-image.png";
                        return { ...course, imageUrl };
                    })
                );
                const unenrolledCourses = await Promise.all(
                    availableCourses.unenrolled.map(async (course) => {
                        const imageUrl = course.id
                            ? await fetchCourseImage(course.id)
                            : "/course-image.png";
                        return { ...course, imageUrl };
                    })
                );
                setCourses({
                    enrolled: enrolledCourses,
                    unenrolled: unenrolledCourses,
                });
            } catch (error) {
                console.error("Error fetching courses", error);
                setCourses({
                    enrolled: [] as CourseListWithImage[],
                    unenrolled: [] as CourseListWithImage[],
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);
    return (
        <div className="">
            <TabsMenu
                leftLabel="My Courses"
                rightLabel="All Courses"
                leftChildren={
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Course Details...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {courses.enrolled.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        id={course.id}
                                        name={course.title}
                                        image={
                                            course.imageUrl ||
                                            "/course-image.png"
                                        }
                                        imageAlt={`${course.title} Cover Image`}
                                        variant="client"
                                        enrolled={true}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                }
                rightChildren={
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Course Materials...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {courses.unenrolled.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        id={course.id}
                                        name={course.title}
                                        image={
                                            course.imageUrl ||
                                            "/course-image.png"
                                        }
                                        imageAlt={`${course.title} Cover Image`}
                                        variant="client"
                                        enrolled={false}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                }
            />
        </div>
    );
}
