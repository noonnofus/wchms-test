"use client";
import { useParams } from "next/navigation";
import TabsMenu from "@/components/shared/tabs-menu";
import CourseDetailsCard from "@/components/courses/course-details-card";
import MaterialCard from "@/components/shared/material-card";
import { useEffect, useState } from "react";
import { getCourseById } from "@/db/queries/courses";

export default function Home() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<any>({}); //TODO: update type, include materials and participant types
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const course = await getCourseById(parseInt(id as string));
                //TODO: update to be dynamic class materials and dynamic participants
                setSelectedCourse({
                    ...course[0],
                    // materials: [
                    //     {
                    //         id: "4",
                    //         type: "Simple Arithmetic" as const,
                    //         difficulty: "Basic" as const,
                    //         title: "Week 4: Just a file",
                    //         content: null,
                    //         createdAt: new Date(1738859550),
                    //         file: "Week4.pdf",
                    //     },
                    //     {
                    //         id: "3",
                    //         type: "Physical Exercise" as const,
                    //         difficulty: "Basic" as const,
                    //         title: "Week 3",
                    //         content: "No review materials this week",
                    //         createdAt: new Date(1738859550),
                    //         file: null,
                    //     },
                    //     {
                    //         id: "2",
                    //         type: "Reading Aloud" as const,
                    //         difficulty: "Intermediate" as const,
                    //         title: "Week 2",
                    //         content:
                    //             "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id enim eget sem maximus accumsan. Pellentesque id varius mi, non sollicitudin orci. Donec eu condimentum justo. Donec vel sapien arcu. Quisque dapibus ligula non imperdiet malesuada.",
                    //         createdAt: new Date(1738859545),
                    //         file: "Week2.pdf",
                    //     },
                    //     {
                    //         id: "1",
                    //         type: "Reading Aloud" as const,
                    //         difficulty: "Intermediate" as const,
                    //         title: "Week 1: A really long title to see how it would look with multiple lines",
                    //         content: "Some description",
                    //         createdAt: new Date(1738859540),
                    //         file: "Week1.pdf",
                    //     },
                    // ],
                });
            } catch (error) {
                console.error("Error fetching courses", error);
                setSelectedCourse([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);
    if (!selectedCourse) {
        return <div>No course found</div>;
    }

    return (
        <div>
            <TabsMenu
                leftLabel="Course Home"
                rightLabel="Course Materials"
                leftChildren={
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Course Details...</p>
                            </div>
                        ) : (
                            <CourseDetailsCard //TODO: Pass Zoom link
                                name={selectedCourse.title}
                                description={selectedCourse?.description}
                                variant="client"
                            />
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
                                {selectedCourse.materials?.length ? (
                                    selectedCourse.materials.map((material) => {
                                        return (
                                            <MaterialCard
                                                key={
                                                    material.title +
                                                    material.createdAt
                                                }
                                                material={material}
                                            />
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col gap-4 text-center py-10">
                                        <p className="text-center text-xl md:text-2xl font-semibold">
                                            No course materials available.
                                        </p>
                                        <p className="text-xl">
                                            Try AI self-study for more
                                            resources!
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                }
            />
        </div>
    );
}
