import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Session } from "@/db/schema/session";
import EditIcon from "../icons/edit-icon";
import DeleteIcon from "../icons/delete-icon";

export default function SessionCard({
    session,
    handleDeleteButtonClick,
    handleEditButtonClick,
    isAdmin,
}: {
    session: Session;
    handleDeleteButtonClick: (sessionId: number) => void;
    handleEditButtonClick: (session: Session) => void;
    isAdmin?: boolean;
}) {
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

    return (
        <div className="flex flex-col items-center w-full">
            <Card
                className={`flex flex-row justify-between items-center gap-4 p-4 shadow-lg rounded-lg ${
                    currentDateTime > session.endTime.toISOString()
                        ? "bg-gray-200"
                        : "bg-white"
                }`}
            >
                <div className="flex items-center gap-4 text-gray-700">
                    <Calendar className="w-6 h-6 text-gray-500" />
                    <div className="flex flex-col justify-center">
                        <span className="font-semibold">{formattedDate}</span>
                        <span>
                            {formattedStartTime} - {formattedEndTime}
                        </span>
                    </div>
                </div>
                {isAdmin && (
                    <div className="flex flex-row gap-2">
                        <button onClick={() => handleEditButtonClick(session)}>
                            <EditIcon />
                        </button>
                        <button
                            onClick={() => handleDeleteButtonClick(session.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
}
