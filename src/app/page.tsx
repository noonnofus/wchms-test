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
    const [participants, setParticipants] = useState<
        { name: string; courses: string[] }[]
    >([]);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await fetch("/api/participants");
                if (!response.ok)
                    throw new Error("Failed to fetch participants");

                const participants = await response.json();

                const uniqueParticipants = participants.map(
                    (p: {
                        participant: Participant;
                        courses: string | null;
                    }) => ({
                        name: p.participant.firstName.toLowerCase(),
                        courses: p.courses ? p.courses.split(", ") : [],
                    })
                );

                setParticipants(uniqueParticipants);
            } catch (error) {
                console.error("Failed to fetch participants", error);
            }
        };

        fetchParticipants();
    }, []);

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
        <div className="flex flex-col gap-12 w-full h-full items-center">
            <h1 className="font-semibold text-4xl">Participants List</h1>
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
                    <h2 className="font-medium text-2xl text-center">
                        Please Select Your First Name
                    </h2>
                    <div className="w-full grid grid-cols-2 grid-rows-auto gap-4 h-full">
                        {participants.map((participant, index) => (
                            <Button
                                asChild
                                key={index}
                                className="capitalize h-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-4"
                            >
                                <Link href={`/${participant.name}`}>
                                    {participant.name}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2 items-center">
                    <p className="text-xl text-center">
                        Don't have an account?
                    </p>
                    <Button className="capitalize h-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-4">
                        <Link href="/signup">Click here to sign up</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
