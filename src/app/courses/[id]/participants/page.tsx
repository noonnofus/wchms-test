"use client";
import ChevronDownIcon from "@/components/icons/chevron-down-icon";
import ChevronUpIcon from "@/components/icons/chevron-up-icon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseFull } from "@/db/schema/course";
import { getCourseById } from "@/db/queries/courses";
import { useTranslation } from "react-i18next";

export default function ClassParticipants() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<
        CourseFull | undefined
    >(undefined);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const course = await getCourseById(
                    parseInt(id as string),
                    false,
                    true,
                    true
                );
                if (course) {
                    setSelectedCourse({
                        ...course,
                        participants: course.participants || [],
                    });
                }
            } catch (error) {
                console.error("Error fetching courses", error);
                setSelectedCourse(undefined);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, [id]);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSortChange = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    const filteredParticipants = (selectedCourse?.participants || [])
        .filter((participant) => {
            const fullName =
                `${participant.firstName} ${participant.lastName}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return sortOrder === "asc"
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
        });

    return isLoading ? (
        <div className="flex justify-center items-center py-10">
            <p>{t("loading.participants")}</p>
        </div>
    ) : (
        <div className="flex flex-col gap-10 w-full items-center">
            <h1 className="font-semibold text-4xl text-center">
                {t("participant list")}
            </h1>
            <Card className="flex flex-col h-full">
                <CardHeader className="w-full">
                    <h2 className="text-xl md:text-3xl font-semibold">
                        {selectedCourse?.title}
                    </h2>
                    <div className="flex gap-2 md:gap-4 items-center">
                        <Input
                            type="text"
                            placeholder={t("search")}
                            className="mt-2 md:mt-4 py-4 md:py-6 w-full"
                            onChange={handleSearchChange}
                        ></Input>
                    </div>
                </CardHeader>
                <CardContent className="w-full flex-grow overflow-auto">
                    <Table className="w-full flex flex-col">
                        <TableHeader>
                            <TableRow className="flex text-base md:text-xl font-semibold">
                                <TableHead className="flex-1 flex gap-2 items-center text-left text-black">
                                    {t("participant", { count: 2 })}
                                    <button
                                        onClick={handleSortChange}
                                        className="flex items-center"
                                    >
                                        {sortOrder === "asc" ? (
                                            <ChevronDownIcon className="text-primary-green" />
                                        ) : (
                                            <ChevronUpIcon className="text-primary-green" />
                                        )}
                                    </button>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredParticipants.map((participant) => {
                                return (
                                    <TableRow
                                        key={participant.id}
                                        className="flex"
                                    >
                                        <TableCell className="flex-1 text-left text-base md:text-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="hidden md:flex md:flex-col md:w-10 md:h-10 rounded-full bg-gray-200 items-center justify-center">
                                                    {`${participant.firstName[0]}${participant.lastName[0]}`}
                                                </div>
                                                {`${participant.firstName} ${participant.lastName}`}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
