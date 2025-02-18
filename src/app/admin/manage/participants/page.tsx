"use client";
import ChevronDownIcon from "@/components/icons/chevron-down-icon";
import ChevronUpIcon from "@/components/icons/chevron-up-icon";
import { Settings, PlusIcon } from "lucide-react";
import DeleteIcon from "@/components/icons/delete-icon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useState, useEffect } from "react";
import AddParticipant from "@/components/manage/add-participant";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import { type Participant } from "@/db/schema/participants";

// TODO: Get the user data from db and show it on the table

export default function ManagePariticipant() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [refreshParticipants, setRefreshParticipants] = useState(false);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/participants")
            .then((res) => res.json())
            .then((data) => {
                setParticipants(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setError("Unexpected error occured.");
                setIsLoading(false);
            })
    }, [refreshParticipants]);

    const handleDeleteButtonClick = (participant: Participant) => {
        setParticipantToDelete(participant);
        setShowDeletePopup(true);
    };

    const handleDelete = async () => {
        if (!participantToDelete) return;

        try {
            const res = await fetch("/api/participants/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participantId: participantToDelete.id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");

            setRefreshParticipants((prev) => !prev);
        } catch (error) {
            console.error("Failed to delete participant", error);
        } finally {
            setShowDeletePopup(false);
            setParticipantToDelete(null);
        }
    };

    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setShowAddPopup(false);
        setParticipantToDelete(null);
    }

    const handleSortChange = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredParticipants = participants
        .filter((participant) => {
            const fullName =
                `${participant.firstName} ${participant.lastName}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();

            if (sortOrder === "asc") {
                return nameA.localeCompare(nameB); // A-Z
            } else {
                return nameB.localeCompare(nameA); // Z-A
            }
        });

    return (
        <div>
            <div className="flex flex-col gap-10 w-full items-center">
                <h1 className="font-semibold text-4xl text-center">Manage</h1>
                {/* Delete Confirmation Popup */}
                {showDeletePopup && participantToDelete && (
                    <div className="absolute inset-0 flex justify-center items-center min-h-[800px] min-w-[360px] w-full h-full bg-black bg-opacity-50 z-50">
                        <div className="relative w-full max-w-lg bg-white rounded-lg p-6 overflow-auto">
                            <DeleteConfirmation
                                title="Before you delete!"
                                body={`Are you sure you want to delete ${participantToDelete.firstName}? You cannot undo this action.`}
                                actionLabel="DELETE"
                                handleSubmit={handleDelete}
                                closePopup={handleClosePopup}
                            />
                        </div>
                    </div>
                )}
                {showAddPopup && (
                    <div className="absolute inset-0 flex justify-center items-center min-h-[800px] min-w-[360px] w-full h-full bg-black bg-opacity-50 z-50">
                        <div className="relative w-full max-w-lg bg-white rounded-lg p-6 overflow-auto">
                            <AddParticipant
                                closePopup={handleClosePopup}
                                onParticipantAdded={() =>
                                    setRefreshParticipants((prev) => !prev)
                                }
                            />
                        </div>
                    </div>
                )}
                <Card className="flex flex-col h-full">
                    <CardHeader className="w-full">
                        <h2 className="text-xl md:text-3xl font-semibold">
                            Participants
                        </h2>
                        <div className="flex gap-2 md:gap-4 items-center">
                            <Input
                                type="text"
                                placeholder="Search"
                                className="mt-2 md:mt-4 py-4 md:py-6 w-full"
                                onChange={handleSearchChange}
                            ></Input>
                            <button
                                className="mt-2 md:mt-4 flex flex-col min-w-8 min-h-8 md:min-h-12 md:min-w-12 border-2 md:border-[3px] border-primary-green text-primary-green rounded-full justify-center items-center"
                                onClick={handleAddButtonClick}
                            >
                                <PlusIcon className="w-3/5 h-3/5" />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="w-full flex-grow overflow-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="grid grid-cols-[auto_auto_1fr_auto_auto] text-base md:text-xl font-semibold items-center">
                                    <TableHead className="flex items-center gap-2 text-left text-black">
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
                                    <TableHead className="flex items-center gap-2 text-left text-black">
                                        Course Assigned
                                        <button
                                            className="flex items-center"
                                        >
                                            <ChevronDownIcon className="text-primary-green" />
                                        </button>
                                    </TableHead>
                                    <div className="flex-1"></div>
                                    <TableHead className="text-center text-black">Delete</TableHead>
                                    <TableHead className="text-center text-black">Edit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading
                                    ? [...Array(3)].map((_, index) => (
                                        <TableRow
                                            className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center"
                                            key={index}
                                        >
                                            <TableCell className="flex items-center gap-4 text-left text-base md:text-lg">
                                                <Skeleton className="hidden md:flex md:w-10 md:h-10 rounded-full" />
                                                <Skeleton className="h-4 w-24 rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-40 rounded" />
                                            </TableCell>
                                            <div className="flex-1"></div>
                                            <TableCell className="flex justify-center items-center">
                                                <Skeleton className="h-6 w-6 rounded" />
                                            </TableCell>
                                            <TableCell className="flex justify-center items-center">
                                                <Skeleton className="h-6 w-6 rounded" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    : filteredParticipants.map((participant: any) => {
                                        return (
                                            <TableRow
                                                className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center"
                                                key={participant.id}
                                            >
                                                <TableCell className="flex items-center gap-4 text-left text-base md:text-lg">
                                                    <div className="hidden md:flex md:w-10 md:h-10 rounded-full bg-gray-200 items-center justify-center">
                                                        {`${participant.firstName[0]}${participant.lastName[0]}`}
                                                    </div>
                                                    {`${participant.firstName} ${participant.lastName}`}
                                                </TableCell>
                                                <TableCell className="flex items-center gap-2 text-left">
                                                    The course this participant assigned here
                                                </TableCell>
                                                <div className="flex-1"></div>
                                                <TableCell
                                                    className="flex justify-center items-center"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setParticipantToDelete(participant)
                                                            handleDeleteButtonClick(participant)
                                                        }}
                                                    >
                                                        <DeleteIcon className="inline-flex text-center" />
                                                    </button>
                                                </TableCell>
                                                <TableCell className="flex justify-center items-center">
                                                    <Link href={`/admin/manage/participants/${participant.id}`}>
                                                        <Settings className="inline-flex text-center" />
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}