"use client";
import CourseCard from "@/components/courses/course-card";
import TabsMenu from "@/components/shared/tabs-menu";

export default function Courses() {
    const myCourses = [
        {
            id: "1",
            name: "Course 122",
            image: "/course-image.png",
            imgAlt: "A Snake",
        },
        {
            id: "2",
            name: "Course 123",
            image: "/course-image.png",
            imgAlt: "A Snake",
        },
    ];
    const allCourses = [
        {
            id: "3",
            name: "第19期：脳の運動教室(シン 脳の運動教室)",
            image: "/course-image.png",
            imgAlt: "A Snake",
        },
        {
            id: "4",
            name: "第20期：脳の運動教室(シン 脳の運動教室)",
            image: "/course-image.png",
            imgAlt: "A Snake",
        },
    ];
    return (
        <div className="">
            <TabsMenu
                leftLabel="My Courses"
                rightLabel="All Courses"
                leftChildren={
                    <div className="flex flex-col gap-4">
                        {myCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                name={course.name}
                                image={course.image}
                                imageAlt={course.imgAlt}
                                variant="client"
                                enrolled={true}
                            />
                        ))}
                    </div>
                }
                rightChildren={
                    <div className="flex flex-col gap-4">
                        {allCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                name={course.name}
                                image={course.image}
                                imageAlt={course.imgAlt}
                                variant="client"
                                enrolled={false}
                            />
                        ))}
                    </div>
                }
            />
        </div>
    );
}
