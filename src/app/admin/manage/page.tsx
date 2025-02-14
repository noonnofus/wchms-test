"use client";
import { useState, useEffect } from "react";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import DeleteIcon from "@/components/icons/delete-icon";
import { type Participant } from "@/db/schema/participants";
import EditParticipant from "@/components/manage/edit-participant";

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
        setParticipantToDelete(null);
        setParticipantToEdit(null);
    };

    const refreshParticipantsList = async () => {
        const response = await fetch("/api/participants");
        const data = await response.json();
        setParticipants(data);
    };

    return (
        <div className="flex flex-col gap-20 w-full h-full items-center">
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

            {/* Edit Participant Popup */}
            {showEditPopup && participantToEdit && (
                <div className="absolute inset-0 flex justify-center items-center min-h-[800px] min-w-[360px] w-full h-full bg-black bg-opacity-50 z-50">
                    <div className="relative w-full max-w-lg bg-white rounded-lg p-6 overflow-auto">
                        <EditParticipant
                            participantData={participantToEdit}
                            closePopup={handleClosePopup}
                            refreshParticipantsList={refreshParticipantsList}
                        />
                    </div>
                </div>
            )}

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
