"use client";
import AddCourse from "@/components/courses/add-course";
import CourseCard from "@/components/courses/course-card";
import { useState } from "react";

export default function Courses() {
    const [showAddPopup, setShowAddPopup] = useState(false);
    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };
    const handleClosePopup = () => {
        setShowAddPopup(false);
    };
    const allCourses = [
        {
            id: "4",
            name: "第20期：脳の運動教室(シン 脳の運動教室)",
            image: "/course-image.png",
            imgAlt: "A Snake",
            description: "20th class",
        },
        {
            id: "3",
            name: "第19期：脳の運動教室(シン 脳の運動教室)",
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
            description:
                "2025年は、60年に一度巡ってくる「乙巳（きのと・み）」の年。乙巳の年は、新しいものが生まれ、成長していく年と言われています。第19期となる脳の運動教室も、今年は「シン 脳の運動教室」としてブラッシュアップしていきます！皆さま、本年もよろしくお願いいたします。",
        },
        {
            id: "1",
            name: "Course 122",
            image: "/course-image.png",
            imgAlt: "A Snake",
            description:
                "2025年は、60年に一度巡ってくる「乙巳（きのと・み）」の年。乙巳の年は、新しいものが生まれ、成長していく年と言われています。第19期となる脳の運動教室も、今年は「シン 脳の運動教室」としてブラッシュアップしていきます！皆さま、本年もよろしくお願いいたします。",
        },
    ];

    return (
        <>
            <h1 className="font-semibold text-4xl text-center mb-6">Courses</h1>
            {showAddPopup && (
                <div className="absolute min-h-full w-full top-0 left-0">
                    <div
                        className="absolute inset-0 bg-black opacity-50 z-10"
                        onClick={handleClosePopup}
                    />

                    <div className="absolute inset-0 flex justify-center items-center z-10 max-h-[90vh] top-1/2 -translate-y-1/2">
                        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg p-6">
                            <AddCourse />
                        </div>
                    </div>
                </div>
            )}
            <button
                className="absolute bottom-24 right-2 md:bottom-24 md:right-6 flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center z-[1]"
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
            <div className="flex flex-col gap-4 pb-10 md:pb-12">
                {allCourses.length
                    ? allCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            name={course.name}
                            image={course.image}
                            imageAlt={course.imgAlt}
                            description={course.description}
                            variant="admin"
                        />
                    ))
                    : "No courses found."}
            </div>
        </>
    );
}
