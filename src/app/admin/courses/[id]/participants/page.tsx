"use client";
import ChevronDownIcon from "@/components/icons/chevron-down-icon";
import ChevronUpIcon from "@/components/icons/chevron-up-icon";
import DeleteIcon from "@/components/icons/delete-icon";
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
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseFull } from "@/db/schema/course";
import { getCourseById } from "@/db/queries/courses";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import { Participant } from "@/db/schema/participants";

export default function ClassParticipants() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<
        CourseFull | undefined
    >(undefined);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [participantToRemove, setParticipantToRemove] =
        useState<Participant | null>(null);
    const [refreshParticipants, setRefreshParticipants] = useState(false);

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
    }, [id, refreshParticipants]);

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

    const handleRemoveButtonClick = (participant: Participant) => {
        setParticipantToRemove(participant);
        setShowDeletePopup(true);
    };

    const handleRemoveParticipant = async () => {
        if (!participantToRemove) return;
        try {
            const response = await fetch("/api/courses/participants/remove", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: participantToRemove.id,
                    courseId: id,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to delete");

            setRefreshParticipants((prev) => !prev);
        } catch (error) {
            console.error("Failed to remove participant from course", error);
        } finally {
            setShowDeletePopup(false);
            setParticipantToRemove(null);
        }
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
    };

    return (
        <div className="flex flex-col gap-10 w-full items-center">
            <h1 className="font-semibold text-4xl text-center">
                Participant List
            </h1>
            {showDeletePopup && participantToRemove && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title="Before you delete!"
                            body={`Are you sure you want to delete ${participantToRemove.firstName}? You cannot undo this action.`}
                            actionLabel="DELETE"
                            handleSubmit={handleRemoveParticipant}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}
            <Card className="flex flex-col h-full">
                <CardHeader className="w-full">
                    <h2 className="text-xl md:text-3xl font-semibold">
                        {selectedCourse?.title}
                    </h2>
                    <div className="flex gap-2 md:gap-4 items-center">
                        <Input
                            type="text"
                            placeholder="Search"
                            className="mt-2 md:mt-4 py-4 md:py-6 w-full"
                            onChange={handleSearchChange}
                        ></Input>
                        <button className="mt-2 md:mt-4 flex flex-col min-w-8 min-h-8 md:min-h-12 md:min-w-12 border-2 md:border-[3px] border-primary-green text-primary-green rounded-full justify-center items-center">
                            <PlusIcon className="w-3/5 h-3/5" />
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="w-full flex-grow overflow-auto">
                    <Table className="w-full flex flex-col">
                        <TableHeader>
                            <TableRow className="flex text-base md:text-xl font-semibold">
                                <TableHead className="flex-1 flex gap-2 items-center text-left text-black">
                                    Participant
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
                                <TableHead className="flex-shrink-0 text-center p-0 w-20 med:w-24 text-black">
                                    Remove
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
                                        <TableCell className="flex justify-center items-center px-0 w-20 med:w-24">
                                            <button
                                                onClick={() =>
                                                    handleRemoveButtonClick(
                                                        participant
                                                    )
                                                }
                                            >
                                                <DeleteIcon className="inline-flex flex-col text-center justify-center items-center" />
                                            </button>
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
