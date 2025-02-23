import { Card } from "@/components/ui/card";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmation from "../shared/delete-confirmation";

interface SessionCardProps {
    date: string;
    startTime: string;
    endTime: string;
    sessionId: number;
    onDelete: () => void;
    onEdit: (sessionId: number) => void;
}

export default function SessionCard({
    date,
    startTime,
    endTime,
    sessionId,
    onDelete,
    onEdit,
}: SessionCardProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
            year: "numeric",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const formatTime = (timeString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        return new Date(timeString).toLocaleTimeString("en-US", options);
    };

    const formattedDate = formatDate(date);
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    const handleDelete = () => {
        onDelete();
        setShowConfirmation(false);
    };

    const handleEdit = () => {
        onEdit(sessionId);
    };

    return (
        <div className="flex flex-col items-center w-full">
            {showConfirmation && (
                <DeleteConfirmation
                    title="Are you sure?"
                    body="This action cannot be undone."
                    actionLabel="Delete"
                    handleSubmit={handleDelete}
                    closePopup={() => setShowConfirmation(false)}
                />
            )}

            {!showConfirmation && (
                <Card className="flex flex-row justify-between items-center gap-4 p-4 shadow-lg rounded-lg bg-white">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span>
                            {formattedDate} | {formattedStartTime} -{" "}
                            {formattedEndTime}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleEdit}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowConfirmation(true)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </Card>
            )}
        </div>
    );
}
