"use client";
import ChevronDownIcon from "@/components/icons/chevron-down-icon";
import ChevronUpIcon from "@/components/icons/chevron-up-icon";
import { Pen, PlusIcon } from "lucide-react";
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
import { useState, useEffect } from "react";
import AddRoom from "@/components/rooms/add-room";
import EditRoom from "@/components/rooms/edit-room";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import CloseIcon from "@/components/icons/close-icon";
import CloseSwipe from "@/components/icons/close-swipe";
import { Room } from "@/db/schema/room";
import AddButton from "@/components/shared/add-button";
import EditIcon from "@/components/icons/edit-icon";


export default function RoomPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
    const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [refreshRooms, setRefreshRooms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/courses/room")
            .then((res) => res.json())
            .then((data) => {
                setRooms(data);
                setIsLoading(false);
            })
    }, [refreshRooms])

    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };

    const handleDeleteButtonClick = (room: Room) => {
        setRoomToDelete(room);
        setShowDeletePopup(true);
    };

    const handleEditButtonClick = (room: Room) => {
        setRoomToEdit(room);
        setShowEditPopup(true);
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setShowAddPopup(false);
        setShowEditPopup(false);
        setRoomToDelete(null);
        setRoomToEdit(null);
    };

    const handleSortChange = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredRooms = rooms
        .filter((arr) => {
            const fullName =
                arr.name.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            if (sortOrder === "asc") {
                return a.name.localeCompare(b.name); // A-Z
            } else {
                return b.name.localeCompare(a.name); // Z-A
            }
        });

    const handleDelete = async () => {
        if (!roomToDelete) return;

        try {
            const res = await fetch("/api/courses/room/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: roomToDelete.id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");

            setRefreshRooms((prev) => !prev);
        } catch (error) {
            console.error("Failed to delete participant", error);
        } finally {
            setShowDeletePopup(false);
            setRoomToDelete(null);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-10 w-full items-center h-full">
                <h1 className="font-semibold text-4xl text-center">Manage</h1>
                {showAddPopup && (
                    <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={handleClosePopup}
                        ></div>
                        <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                            <div className="relative w-full">
                                <div
                                    className="flex justify-center items-center p-6 md:hidden "
                                // {...swipeHandlers}
                                >
                                    {/* Swipe indicator */}
                                    <div className="absolute top-6 md:hidden">
                                        <CloseSwipe />
                                    </div>
                                </div>
                                <button
                                    onClick={handleClosePopup}
                                    className="absolute top-3 right-4"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                                <AddRoom
                                    closePopup={handleClosePopup}
                                    onRoomAdded={() =>
                                        setRefreshRooms((prev) => !prev)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
                {showEditPopup && roomToEdit && (
                    <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={handleClosePopup}
                        ></div>
                        <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                            <div className="relative w-full">
                                <div
                                    className="flex justify-center items-center p-6 md:hidden "
                                // {...swipeHandlers}
                                >
                                    {/* Swipe indicator */}
                                    <div className="absolute top-6 md:hidden">
                                        <CloseSwipe />
                                    </div>
                                </div>
                                <button
                                    onClick={handleClosePopup}
                                    className="absolute top-3 right-4"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                                <EditRoom
                                    closePopup={handleClosePopup}
                                    roomData={roomToEdit}
                                    onRoomUpdated={() =>
                                        setRefreshRooms((prev) => !prev)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
                {showDeletePopup && roomToDelete && (
                    <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={handleClosePopup}
                        ></div>
                        <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                            <DeleteConfirmation
                                title="Before you delete!"
                                body={`Are you sure you want to delete room: ${roomToDelete.name}? You cannot undo this action.`}
                                actionLabel="DELETE"
                                handleSubmit={handleDelete}
                                closePopup={handleClosePopup}
                            />
                        </div>
                    </div>
                )}
                <div className="flex flex-col h-full gap-4">
                    <div className="w-full">
                        <h2 className="text-xl md:text-3xl font-semibold">
                            Room List
                        </h2>
                        <Input
                            type="text"
                            placeholder="Search"
                            className="mt-2 md:mt-4 py-4 md:py-6 w-full"
                            onChange={handleSearchChange}
                        ></Input>
                    </div>
                    <Table className="table-fixed w-full border-collapse">
                        <TableHeader>
                            <TableRow className="flex w-full justify-between text-base md:text-xl font-semibold">
                                <TableHead className="flex-1 min-w-[200px] text-left">Name
                                    <button
                                        onClick={handleSortChange}
                                        className="ml-2"
                                    >
                                        {sortOrder === "asc" ? (
                                            <ChevronDownIcon className="text-primary-green" />
                                        ) : (
                                            <ChevronUpIcon className="text-primary-green" />
                                        )}
                                    </button></TableHead>
                                <TableHead className="flex-1 min-w-[120px] text-left">Capacity</TableHead>
                                <TableHead className="flex-1 min-w-[200px] text-left">Type</TableHead>
                                <TableHead className="flex-1 min-w-[80px] text-center">Delete</TableHead>
                                <TableHead className="flex-1 min-w-[80px] text-center">Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? [...Array(3)].map((_, index) => (
                                    <TableRow className="flex w-full justify-between items-center" key={index}>
                                        <TableCell className="flex-1 min-w-[200px] text-left">
                                            <Skeleton className="h-4 w-24 rounded" />
                                        </TableCell>
                                        <TableCell className="flex-1 min-w-[120px]">
                                            <Skeleton className="h-4 w-24 rounded" />
                                        </TableCell>
                                        <TableCell className="flex-1 min-w-[200px]">
                                            <Skeleton className="h-4 w-24 rounded" />
                                        </TableCell>
                                        <TableCell className="flex-1 min-w-[80px] flex justify-center items-center">
                                            <Skeleton className="h-6 w-6 rounded" />
                                        </TableCell>
                                        <TableCell className="flex-1 min-w-[80px] flex justify-center items-center">
                                            <Skeleton className="h-6 w-6 rounded" />
                                        </TableCell>
                                    </TableRow>
                                ))
                                : filteredRooms.map(
                                    (room: Room) => (
                                        <TableRow
                                            className="flex w-full justify-between items-center"
                                            key={room.id}
                                        >
                                            <TableCell className="flex-1 min-w-[200px] text-left text-base md:text-lg">
                                                {room.name}
                                            </TableCell>
                                            <TableCell className="flex-1 min-w-[120px] text-left text-base md:text-lg">
                                                {room.capacity !== null && room.capacity !== undefined ? room.capacity : "Unlimited"}
                                            </TableCell>
                                            <TableCell className="flex-1 min-w-[200px] text-left text-base md:text-lg">
                                                {room.medium}
                                            </TableCell>
                                            <TableCell className="flex-1 min-w-[80px] flex justify-center items-center">
                                                <button
                                                    onClick={() =>
                                                        handleDeleteButtonClick(
                                                            room
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon className="inline-flex text-center" />
                                                </button>
                                            </TableCell>
                                            <TableCell className="flex-1 min-w-[80px] flex justify-center items-center">
                                                <button
                                                    onClick={() =>
                                                        handleEditButtonClick(
                                                            room
                                                        )
                                                    }
                                                >
                                                    <EditIcon />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                        </TableBody>
                    </Table>
                </div>
                <AddButton handleAddButtonClick={handleAddButtonClick} />
            </div>
        </div>
    );
}