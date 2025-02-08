"use client";
import AddCourse from "@/components/courses/add-course";
import { useState } from "react";

export default function Courses() {
    const [showAddModal, setShowAddModal] = useState(false);
    const handleAddButtonClick = () => {
        setShowAddModal(true);
    };

    return (
        <div>
            <button
                className="flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center"
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
            {showAddModal && <AddCourse />}
        </div>
    );
}
