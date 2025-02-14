"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import AddParticipant from "@/components/manage/add-participant";
import { type Participant } from "@/db/schema/participants";

const courses = [
    {
        name: "第19期：脳の運動教室(シン 脳の運動教室)",
        participants: ["Max", "Angus", "Kevin"],
    },
    {
        name: "Course 2025",
        participants: ["Armaan", "Annabelle", "Tomoko", "Aless", "Emmy"],
    },
];

export default function ParticipantLogin() {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    // const allParticipants = courses.flatMap((course) => course.participants);
    const [participants, setParticipants] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshParticipants, setRefreshParticipants] = useState(false);

    const [showAddPopup, setShowAddPopup] = useState(false);
    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };
    const handleClosePopup = () => {
        setShowAddPopup(false);
        setRefreshParticipants((prev) => !prev);
    };

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await fetch("/api/participants");
                if (!response.ok)
                    throw new Error("Failed to fetch participants");
                const participants: Participant[] = await response.json();
                const firstNames = participants.map(
                    (participant: { firstName: string }) =>
                        participant.firstName
                );

                const uniqueParticipants: string[] = [
                    ...new Set(
                        firstNames.map((name: string) => name.toLowerCase())
                    ),
                ];

                setParticipants(uniqueParticipants);
            } catch (error) {
                console.error("Failed to fetch participants", error);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, [refreshParticipants]);

    const handleCourseSelect = (courseName: string) => {
        // if (courseName === "All Courses") {
        //     setParticipants(allParticipants);
        //     setSelectedCourse(null);
        // } else {
        //     setSelectedCourse(courseName);
        //     const selectCourseObj = courses.find(
        //         (course) => course.name === courseName
        //     );
        //     if (selectCourseObj) {
        //         setParticipants(selectCourseObj.participants);
        //     }
        // }
    };

    return (
        <div className="flex flex-col gap-20 w-full h-full items-center">
            <h1 className="font-semibold text-4xl">Participants List</h1>
            {showAddPopup && (
                <div className="absolute inset-0 flex justify-center items-center min-h-[800px] min-w-[360px] w-full h-full bg-black bg-opacity-50 z-50">
                    <div className="relative w-full max-w-lg bg-white rounded-lg p-6 overflow-auto">
                        <AddParticipant closePopup={handleClosePopup} />
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
            <div className="flex flex-col w-full items-center gap-10">
                <div className="flex flex-col w-full items-center gap-4">
                    <h2 className="font-medium text-2xl">Select a Course</h2>
                    <Select onValueChange={handleCourseSelect}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Courses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Courses">
                                All Courses
                            </SelectItem>
                            {courses.map((course, index) => (
                                <SelectItem key={index} value={course.name}>
                                    {course.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col w-full items-center gap-4">
                    <h2 className="font-medium text-2xl">
                        Please Select Your First Name
                    </h2>
                    <div className="w-full grid grid-cols-2 grid-rows-4 gap-4 h-full">
                        {participants.map((participant, index) => (
                            <Button
                                asChild
                                key={index}
                                className="capitalize h-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-4"
                            >
                                <Link href={`/${participant}`}>
                                    {participant}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
