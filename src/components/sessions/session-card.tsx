import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useState } from "react";
import DeleteConfirmation from "../shared/delete-confirmation";
import { Session } from "@/db/schema/session";
import EditIcon from "../icons/edit-icon";
import DeleteIcon from "../icons/delete-icon";
import AddSession from "./add-session";
import CloseSwipe from "../icons/close-swipe";
import CloseIcon from "../icons/close-icon";
import { useSwipeable } from "react-swipeable";

export default function SessionCard({
    session,
    onDelete,
    isAdmin,
}: {
    session: Session;
    onDelete?: () => void;
    isAdmin?: boolean;
}) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showEditSessionPopup, setShowEditSessionPopup] = useState(false);
    const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);

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
        setShowEditSessionPopup(false);
    };

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

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

            {showEditSessionPopup && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    />
                    <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <div className="relative w-full">
                            <div
                                className="flex justify-center items-center p-6 md:hidden "
                                {...swipeHandlers}
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
                            <AddSession
                                courseId={session.courseId}
                                sessionId={session.id}
                                handleClosePopup={handleClosePopup}
                            />
                        </div>
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
                    <div className="flex items-center gap-4 text-gray-700">
                        <Calendar className="w-6 h-6 text-gray-500" />
                        <div className="flex flex-col justify-center">
                            <span className="font-semibold">
                                {formattedDate}
                            </span>
                            <span>
                                {formattedStartTime} - {formattedEndTime}
                            </span>
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="flex flex-row gap-2">
                            <button
                                onClick={() => {
                                    setShowEditSessionPopup(true);
                                    setSessionToEdit(session);
                                }}
                            >
                                <EditIcon />
                            </button>
                            <button
                                onClick={() => setShowConfirmation(true)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <DeleteIcon />
                            </button>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
