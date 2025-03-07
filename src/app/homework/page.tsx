"use client";

import TabsMenu from "@/components/shared/tabs-menu";
import { useEffect, useState } from "react";
import { getAllCourses } from "@/db/queries/courses";
import { CourseFull } from "@/db/schema/course";
import HomeworkCard from "@/components/shared/homework-card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// TODO: Implement course materials tab.

const difficulties = ["Basic", "Intermediate"];

export default function HomeworkPage() {
    // Make it true after implementing getting materials.
    const [isLoading, setIsLoading] = useState(false);
    const [difficulty, setDifficulty] = useState("Basic");
    const [selectedCourse, setSelectedCourse] = useState<
        CourseFull[] | undefined
    >(undefined);

    useEffect(() => {
        const fetchCourses = async () => {
            const fetchCourses = async () => {
                try {
                    const course = await getAllCourses();

                    if (course) {
                        setSelectedCourse({
                            ...course,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching courses", error);
                    // setSelectedCourse(undefined);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchCourses();
        };
        fetchCourses();
    }, []);

    if (!selectedCourse) {
        return <div>No course found</div>;
    }

    const handleDifficultySelect = (difficulty: string) => {
        setDifficulty(difficulty);
    };

    return (
        <div>
            <TabsMenu
                leftLabel="Course Materials"
                rightLabel="AI Self-Study"
                leftChildren={
                    <>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <p>Loading Course Materials...</p>
                            </div>
                        ) : (
                            <>
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-10">
                                        <p>Loading Course Materials...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {selectedCourse.length ? (
                                            selectedCourse.map((item) => {
                                                console.log(item);
                                                return (
                                                    // <MaterialCard
                                                    //     key={
                                                    //         item.materials?.title +
                                                    //         item.materials?.createdAt
                                                    //     }
                                                    //     material={item.materials}
                                                    // />
                                                    <></>
                                                );
                                            })
                                        ) : (
                                            <div className="flex flex-col gap-4 text-center py-10">
                                                <p className="text-center text-xl md:text-2xl font-semibold">
                                                    No course materials
                                                    available.
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
                        )}
                    </>
                }
                rightChildren={
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex justify-center max-w-[1000px] w-full items-center gap-4">
                            <p className="text-2xl">Difficulty:</p>
                            <Select
                                value={difficulty}
                                onValueChange={handleDifficultySelect}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    {difficulties.map((difficulty, index) => (
                                        <SelectItem
                                            key={index}
                                            value={difficulty}
                                        >
                                            {difficulty}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <HomeworkCard
                            title="Physical Activity"
                            activity="physical"
                            difficulty={difficulty}
                        />
                        <HomeworkCard
                            title="Reading Aloud Activity"
                            activity="reading"
                            difficulty={difficulty}
                        />
                        <HomeworkCard
                            title="Simple Arithmetic Activity"
                            activity="arithmetic"
                            difficulty={difficulty}
                        />
                    </div>
                }
            />
        </div>
    );
}
