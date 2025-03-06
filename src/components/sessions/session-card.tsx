import { Card } from "@/components/ui/card";
import { Calendar, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmation from "../shared/delete-confirmation";
import { Session } from "@/db/schema/session";

type SessionPreview = Omit<Session, "status" | "courseId" | "instructorId">;

export default function SessionCard({
    session,
    onDelete,
    isAdmin,
}: {
    session: SessionPreview;
    onDelete?: () => void;
    isAdmin?: boolean;
}) {
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

    const formattedDate = formatDate(session.date.toISOString());
    const formattedStartTime = formatTime(session.startTime.toISOString());
    const formattedEndTime = formatTime(session.endTime.toISOString());
    const currentDateTime = new Date().toISOString();

    const handleDelete = () => {
        onDelete?.();
        setShowConfirmation(false);
    };

    const handleClosePopup = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="flex flex-col items-center w-full">
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title="Are you sure?"
                            body="This action cannot be undone."
                            actionLabel="Delete"
                            handleSubmit={handleDelete}
                            closePopup={() => setShowConfirmation(false)}
                        />
                    </div>
                </div>
            )}

            {!showConfirmation && (
                <Card
                    className={`flex flex-row justify-between items-center gap-4 p-4 shadow-lg rounded-lg ${
                        currentDateTime > session.endTime.toISOString()
                            ? "bg-gray-200"
                            : "bg-white"
                    }`}
                >
                    <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span>
                            {formattedDate} | {formattedStartTime} -{" "}
                            {formattedEndTime}
                        </span>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => setShowConfirmation(true)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </Card>
            )}
        </div>
    );
}
