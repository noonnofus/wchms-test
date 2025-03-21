"use client";
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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ParticipantLogin() {
    const { t } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState<
        { name: string; courses: { id: number; title: string }[] }[]
    >([]);
    const [allParticipants, setAllParticipants] = useState<
        { name: string; courses: { id: number; title: string }[] }[]
    >([]);
    const [courses, setCourses] = useState<
        {
            id: number;
            title: string;
        }[]
    >([]);
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === "authenticated") {
            if (
                session.user.role === "Admin" ||
                session.user.role === "Staff"
            ) {
                return router.push("/admin/landing");
            }
            router.push("/landing");
        } else if (status === "loading") {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [status, router]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getAllCourses();
                const courseData = courses.map((course: Course) => ({
                    id: course.id,
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
                    courses: { id: number; title: string }[];
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
                                ? p.course.split(",").map((courseStr) => {
                                      const [idStr, ...titleParts] = courseStr
                                          .trim()
                                          .split(":");
                                      const id = parseInt(idStr);
                                      const title = titleParts.join(":").trim();
                                      return { id, title };
                                  })
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

                            if (participant && p.course) {
                                const newCourses = p.course
                                    .split(",")
                                    .map((courseStr) => {
                                        const [idStr, ...titleParts] = courseStr
                                            .trim()
                                            .split(":");
                                        const id = parseInt(idStr);
                                        const title = titleParts
                                            .join(":")
                                            .trim();
                                        return { id, title };
                                    });

                                newCourses.forEach((newCourse) => {
                                    if (
                                        !participant.courses.some(
                                            (c) => c.id === newCourse.id
                                        )
                                    ) {
                                        participant.courses.push(newCourse);
                                    }
                                });
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

    const handleCourseSelect = (courseValue: string) => {
        if (courseValue === "All Courses") {
            setParticipants(allParticipants);
        } else {
            const [idStr, title] = courseValue.split("|"); // eslint-disable-line
            const courseId = parseInt(idStr);

            const filteredParticipants = allParticipants.filter((p) =>
                p.courses.some((course) => course.id === courseId)
            );

            setParticipants(filteredParticipants);
        }
    };
    if (loading) return null;
    return (
        <div className="flex flex-col gap-12 w-full h-full items-center">
            <h1 className="font-semibold text-4xl">{t("participant list")}</h1>
            <div className="flex flex-col w-full items-center gap-10">
                <div className="flex flex-col w-full items-center gap-4">
                    <h2 className="font-medium text-2xl">
                        {t("select a course")}
                    </h2>
                    <Select onValueChange={handleCourseSelect}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Courses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Courses">
                                All Courses
                            </SelectItem>
                            {courses.map((course) => (
                                <SelectItem
                                    key={course.id}
                                    value={`${course.id}|${course.title}`}
                                >
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col w-full items-center gap-4">
                    <h2 className="font-medium text-2xl text-center">
                        {t("landing instructions")}
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
                    <p className="text-xl text-center">{t("no account")}</p>
                    <Button className="capitalize h-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-4">
                        <Link href="/signup">{t("button.signup")}</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
