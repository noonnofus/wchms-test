"use client";
import CourseCard from "@/components/courses/course-card";
import TabsMenu from "@/components/shared/tabs-menu";
import {
    courseList,
    fetchCourseImage,
    getAvailableCourses,
} from "@/db/queries/courses";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
    const { data: session } = useSession();
    const participantId = session?.user.id;
    console.log("session", session);
    useEffect(() => {
        if (!participantId || status === "loading") return;
        const fetchCourses = async () => {
            try {
                const availableCourses = await getAvailableCourses(
                    parseInt(participantId)
                );
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
                console.log(unenrolledCourses);
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
    }, [participantId]);

    if (!session) {
        return (
            <div className="flex justify-center items-center py-10">
                Please log in to view courses.
            </div>
        );
    }

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
                        ) : courses.enrolled.length === 0 ? (
                            <div className="flex flex-col justify-center items-center py-10">
                                <p className="text-center text-xl font-semibold mb-4">
                                    No courses enrolled in yet.
                                </p>
                                <p className="text-center text-xl mb-4">
                                    Browse all courses to get started.
                                </p>
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
                        ) : courses.unenrolled.length === 0 ? (
                            <div className="flex flex-col justify-center items-center py-10">
                                <p className="text-center text-xl font-semibold mb-4">
                                    No courses available.
                                </p>
                                <p className="text-center text-xl mb-4">
                                    Please refresh the page or check back at a
                                    later date.
                                </p>
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
