"use client";
import AddSession from "@/components/sessions/add-session";
import { useState } from "react";
// test if add session works - delete later
export default function SessionsPage() {
    const [showAddPopup, setShowAddPopup] = useState(false);

    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
    };

    return (
        <div className="w-full h-full">
            <h1 className="font-semibold text-4xl text-center mb-6">
                Sessions
            </h1>

            {showAddPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="relative z-20 flex flex-col items-center bg-white rounded-lg overflow-y-auto w-full mx-4 max-h-[90vh]">
                        <AddSession
                            handleClosePopup={handleClosePopup}
                            courseId={1} // would have to send in body.courseId when in place
                        />
                    </div>
                </div>
            )}

            <button
                className="absolute bottom-24 right-6 flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center z-[1]"
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
        </div>
    );
}
