"use client";
import ExercisePage from "@/components/homework/Progress-feedback";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAllCourses } from "@/db/queries/courses";
import { type Course } from "@/db/schema/course";
import { type Participant } from "@/db/schema/participants";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ParticipantLogin() {
    const [participants, setParticipants] = useState<
        { name: string; courses: string[] }[]
    >([]);
    const [allParticipants, setAllParticipants] = useState<
        { name: string; courses: string[] }[]
    >([]);
    const [courses, setCourses] = useState<
        {
            title: string;
        }[]
    >([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getAllCourses();
                const courseData = courses.map((course: Course) => ({
                    title: course.title,
                }));
                setCourses(courseData);
            } catch (error) {
                console.error("Error fetching courses", error);
            }
        };
        const fetchParticipants = async () => {
            try {
                const response = await fetch("/api/participants");
                if (!response.ok)
                    throw new Error("Failed to fetch participants");

                const participants = await response.json();

                const uniqueParticipants: {
                    name: string;
                    courses: string[];
                }[] = [];

                const seenNames = new Set(); // stores unique first names to check for duplicates

                participants.forEach(
                    (p: {
                        participant: Participant;
                        course: string | null;
                    }) => {
                        const firstName = p.participant.firstName.toLowerCase();

                        if (!seenNames.has(firstName)) {
                            seenNames.add(firstName);
                            const coursesArray = p.course
                                ? p.course
                                      .split(",")
                                      .map((course) => course.trim())
                                : [];
                            uniqueParticipants.push({
                                name: firstName,
                                courses: coursesArray,
                            });
                        } else {
                            // if name exists, push course name to existing courses array under existing name
                            const participant = uniqueParticipants.find(
                                (p) => p.name === firstName
                            );
                            if (participant) {
                                const participantCourses = p.course
                                    ? p.course
                                          .split(",")
                                          .map((course) => course.trim())
                                    : [];
                                participant.courses.push(...participantCourses);
                            }
                        }
                    }
                );

                setParticipants(uniqueParticipants);
                setAllParticipants(uniqueParticipants);
            } catch (error) {
                console.error("Failed to fetch participants", error);
            }
        };

        fetchParticipants();
        fetchCourses();
    }, []);

    const handleCourseSelect = (courseName: string) => {
        if (courseName === "All Courses") {
            setParticipants(allParticipants);
        } else {
            const filteredParticipants = allParticipants.filter((p) =>
                p.courses.includes(courseName)
            );
            setParticipants(filteredParticipants);
        }
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
                                <SelectItem key={index} value={course.title}>
                                    {course.title}
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
