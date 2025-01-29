"use client";
import { useParams } from "next/navigation";
import TabsMenu from "@/components/shared/tabs-menu";
import CourseDetailsCard from "@/components/courses/course-details-card";
import ExerciseCard from "@/components/shared/exercise-card";

export default function Home() {
    const { id } = useParams();

    const myCourses = [
        {
            id: "1",
            name: "Course 122",
            image: "/course-image.png",
            imgAlt: "A Snake",
            description:
                "2025年は、60年に一度巡ってくる「乙巳（きのと・み）」の年。乙巳の年は、新しいものが生まれ、成長していく年と言われています。第19期となる脳の運動教室も、今年は「シン 脳の運動教室」としてブラッシュアップしていきます！皆さま、本年もよろしくお願いいたします。",
        },
        {
            id: "2",
            name: "Course 123",
            image: "/course-image.png",
            imgAlt: "A Snake",
            description: "Course Description",
        },
    ];

    const course = myCourses.find((course) => course.id === id); // find course based on course id
    if (!course) {
        return <div>No course found</div>;
    }

    return (
        <div>
            <TabsMenu
                leftLabel="Course Home"
                rightLabel="Course Exercises"
                leftChildren={
                    <CourseDetailsCard
                        name={course.name}
                        description={course?.description}
                    />
                }
                rightChildren={
                    <div className="flex flex-col gap-4">
                        <ExerciseCard name="Physical" />
                        <ExerciseCard name="Reading Aloud" />
                        <ExerciseCard name="Simple Arithmetic" />
                    </div>
                }
            />
        </div>
    );
}
