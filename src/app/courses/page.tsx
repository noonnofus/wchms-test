"use client";
import CourseCard from "@/components/courses/course-card";
import TabsMenu from "@/components/shared/tabs-menu";
import { courseList, getAvailableCourses } from "@/db/queries/courses";
import { type Course } from "@/db/schema/course";
import { useEffect, useState } from "react";

export default function Courses() {
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState<{
        enrolled: courseList[];
        unenrolled: courseList[];
    }>({ enrolled: [] as courseList[], unenrolled: [] as courseList[] });
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const availableCourses = await getAvailableCourses();
                setCourses(availableCourses);
            } catch (error) {
                console.error("Error fetching courses", error);
                setCourses({
                    enrolled: [] as courseList[],
                    unenrolled: [] as courseList[],
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
                                        image={"/course-image.png"} // TODO: Add image reference
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
                                        image={"/course-image.png"} // TODO: Add image reference
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
