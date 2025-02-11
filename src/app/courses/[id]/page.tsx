"use client";
import { useParams } from "next/navigation";
import TabsMenu from "@/components/shared/tabs-menu";
import CourseDetailsCard from "@/components/courses/course-details-card";
import MaterialCard from "@/components/shared/material-card";

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
            materials: [
                {
                    title: "Week 4: Just a file",
                    content: null,
                    createdAt: new Date(1738859550),
                    file: "Week4.pdf",
                },
                {
                    title: "Week 3",
                    content: "No review materials this week",
                    createdAt: new Date(1738859550),
                    file: null,
                },
                {
                    title: "Week 2",
                    content:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id enim eget sem maximus accumsan. Pellentesque id varius mi, non sollicitudin orci. Donec eu condimentum justo. Donec vel sapien arcu. Quisque dapibus ligula non imperdiet malesuada.",
                    createdAt: new Date(1738859545),
                    file: "Week2.pdf",
                },
                {
                    title: "Week 1: A really long title to see how it would look with multiple lines",
                    content: "Some description",
                    createdAt: new Date(1738859540),
                    file: "Week1.pdf",
                },
            ],
        },
        {
            id: "2",
            name: "Course 123",
            image: "/course-image.png",
            imgAlt: "A Snake",
            description: "Course Description",
            materials: [],
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
                rightLabel="Course Materials"
                leftChildren={
                    <CourseDetailsCard
                        name={course.name}
                        description={course?.description}
                        variant="client"
                    />
                }
                rightChildren={
                    <div className="flex flex-col gap-4">
                        {course.materials.length ? (
                            course.materials.map((material) => {
                                return (
                                    <MaterialCard
                                        key={
                                            material.title + material.createdAt
                                        }
                                        material={material}
                                    />
                                );
                            })
                        ) : (
                            <p>No course materials available.</p>
                        )}
                    </div>
                }
            />
        </div>
    );
}
