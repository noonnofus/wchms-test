"use client";
import { useState, useEffect } from "react";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import DeleteIcon from "@/components/icons/delete-icon";
import { type Participant } from "@/db/schema/participants";
import EditParticipant from "@/components/manage/edit-participant";
import AddParticipant from "@/components/manage/add-participant";
import CloseIcon from "@/components/icons/close-icon";

export default function Manage() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshParticipants, setRefreshParticipants] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [participantToDelete, setParticipantToDelete] =
        useState<Participant | null>(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [participantToEdit, setParticipantToEdit] =
        useState<Participant | null>(null);

    const [showAddPopup, setShowAddPopup] = useState(false);
    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await fetch("/api/participants");
                if (!response.ok)
                    throw new Error("Failed to fetch participants");

                const participants: Participant[] = await response.json();
                setParticipants(participants);
            } catch (error) {
                console.error("Failed to fetch participants", error);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
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

            console.log("Participant deleted successfully");
            setRefreshParticipants((prev) => !prev);
        } catch (error) {
            console.error("Failed to delete participant", error);
        } finally {
            setShowDeletePopup(false);
            setParticipantToDelete(null);
        }
    };

    const handleEditButtonClick = (participant: Participant) => {
        setParticipantToEdit(participant);
        setShowEditPopup(true);
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setShowEditPopup(false);
        setShowAddPopup(false);
        setParticipantToDelete(null);
        setParticipantToEdit(null);
    };

    return (
        <div className="flex flex-col gap-20 w-full h-full items-center">
            {/* Delete Confirmation Popup */}
            {showDeletePopup && participantToDelete && (
                <div className="absolute inset-0 flex justify-center items-center min-h-[800px] min-w-[360px] w-full h-full bg-black bg-opacity-50 z-50">
                    <div className="relative w-full bg-white rounded-lg p-6 overflow-auto">
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

            {/* Edit Participant Popup */}
            {showEditPopup && participantToEdit && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <div className="relative w-full">
                            <div className="flex justify-center items-center relative p-6">
                                <div className="w-1/3 md:hidden border-b-2 border-black"></div>
                                <button
                                    onClick={handleClosePopup}
                                    className="absolute top-3 right-4"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                            <EditParticipant
                                participantData={participantToEdit}
                                closePopup={handleClosePopup}
                                onParticipantUpdated={() =>
                                    setRefreshParticipants((prev) => !prev)
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {showAddPopup && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <div className="relative w-full">
                            <div className="flex justify-center items-center relative p-6">
                                <div className="w-1/3 md:hidden border-b-2 border-black"></div>
                                <button
                                    onClick={handleClosePopup}
                                    className="absolute top-3 right-4"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                            <AddParticipant
                                closePopup={handleClosePopup}
                                onParticipantAdded={() =>
                                    setRefreshParticipants((prev) => !prev)
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            <h1 className="font-semibold text-4xl">Manage</h1>
            <button
                className="absolute bottom-20 right-6 flex h-[72px] w-[72px] bg-primary-green shadow-lg border-4 border-white rounded-full justify-center items-center z-10"
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
                    <div className="w-full grid grid-cols-2 grid-rows-4 gap-4 h-full">
                        {participants.map((participant) => (
                            <div
                                key={participant.id}
                                className="flex justify-between items-center w-full"
                            >
                                <p>{participant.firstName}</p>
                                <div className="flex gap-4">
                                    {/* Edit Button */}
                                    <button
                                        onClick={() =>
                                            handleEditButtonClick(participant)
                                        }
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() =>
                                            handleDeleteButtonClick(participant)
                                        }
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
