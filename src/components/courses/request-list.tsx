"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CourseJoinRequest } from "@/db/schema/courseJoinRequests";
import { useEffect, useState } from "react";
import { getAllCourseJoinRequests } from "@/db/queries/courses";
import { Participant } from "@/db/schema/participants";
import { getParticipantById } from "@/db/queries/participants";
import { Check } from "lucide-react";
import CloseIcon from "../icons/close-icon";
import DeleteConfirmation from "../shared/delete-confirmation";
import { useTranslation } from "react-i18next";

export default function RequestOverviewCard({
    requests,
    approveParticipantJoinLocally,
}: {
    requests: CourseJoinRequest[];
    approveParticipantJoinLocally: (participant: Participant) => void;
}) {
    const { t } = useTranslation();
    const { id } = useParams();
    const [courseJoinRequests, setCourseJoinRequests] =
        useState<CourseJoinRequest[]>();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [requestToDelete, setRequestToDelete] =
        useState<CourseJoinRequest | null>(null);

    useEffect(() => {
        if (!requests || requests.length === 0) return;

        const fetchParticipants = async () => {
            try {
                const fetchedParticipants = await Promise.all(
                    requests.map(async (req) => {
                        if (!req.participantId) return null;
                        return await getParticipantById(req.participantId);
                    })
                );
                setParticipants(
                    fetchedParticipants.filter(
                        (participant): participant is Participant =>
                            participant !== null
                    )
                );
            } catch (error) {
                console.error("Error fetching participants", error);
            }
        };

        fetchParticipants();
    }, [courseJoinRequests]);

    useEffect(() => {
        const fetchJoinRequests = async () => {
            if (!id) return;
            try {
                const requests = await getAllCourseJoinRequests(Number(id));
                setCourseJoinRequests(requests);
            } catch (error) {
                console.error("Error fetching course join requests", error);
            }
        };
        fetchJoinRequests();
    }, [id, requests]);

    const handleApproveRequest = async (
        request: CourseJoinRequest,
        participant: Participant
    ) => {
        if (!id) return;
        try {
            // Add participant to course
            const response = await fetch("/api/courses/participants/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: participant.id,
                    courseId: id,
                }),
            });

            if (!response.ok)
                throw new Error("Failed to add participant to course");

            await response.json();

            // Delete course join request
            await fetch("/api/requests/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestId: request.id }),
            });

            // Update the requests list
            approveParticipantJoinLocally(participant);

            setCourseJoinRequests((prev) =>
                prev?.filter((r) => r.id !== request.id)
            );
        } catch (error) {
            console.error("Error approving request", error);
        }
    };

    const handleRejectRequestClick = (request: CourseJoinRequest) => {
        setShowDeletePopup(true);
        setRequestToDelete(request);
    };

    const handleDeleteJoinRequest = async (e: React.FormEvent) => {
        if (!requestToDelete) return;
        try {
            e.preventDefault();
            const response = await fetch("/api/requests/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestId: requestToDelete.id }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to delete");
            setCourseJoinRequests((prev) =>
                prev?.filter((r) => r.id !== requestToDelete.id)
            );
        } catch (error) {
            console.error("Error deleting request: ", error);
        } finally {
            setShowDeletePopup(false);
            setRequestToDelete(null);
        }
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setRequestToDelete(null);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <Card className="w-full max-w-none overflow-hidden">
                <CardHeader className="w-full py-4 md:py-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-left text-2xl md:text-[32px]">
                            {t("join requests")}
                        </CardTitle>
                        <Link href={`/admin/courses/${id}/requests`}>
                            <p className="text-primary-green text-sm md:text-xl font-semibold">
                                {t("view all")}
                            </p>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="overflow-x-auto w-full h-full">
                    <div className="flex overflow-x-auto min-w-max space-x-4">
                        {courseJoinRequests && participants.length > 0 ? (
                            participants.map((participant) => {
                                const request = courseJoinRequests.find(
                                    (r) => r.participantId === participant.id
                                );
                                if (!request) return null;
                                return (
                                    <div
                                        className="flex flex-col gap-4 w-40 md:w-52 h-auto border-2 border-primary-green rounded-lg p-2 md:p-4"
                                        key={participant.id}
                                    >
                                        <p className="text-lg md:text-2xl font-semibold">
                                            {`${participant.firstName} ${participant.lastName}`}
                                        </p>
                                        <div className="self-center w-14 md:w-20 aspect-square rounded-full bg-gray-300 flex items-center justify-center">
                                            {`${participant.firstName[0]}${participant.lastName[0]}`}
                                        </div>

                                        {id && (
                                            <div className="w-full h-full flex gap-2 items-center justify-center">
                                                <Button
                                                    onClick={() =>
                                                        handleApproveRequest(
                                                            request,
                                                            participant
                                                        )
                                                    }
                                                    className="w-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-sm md:text-base"
                                                >
                                                    <Check />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        handleRejectRequestClick(
                                                            request
                                                        )
                                                    }
                                                    className="w-full rounded-full bg-destructive-red text-destructive-text hover:bg-destructive-hover font-semibold text-sm md:text-base"
                                                >
                                                    <CloseIcon />
                                                </Button>
                                            </div>
                                        )}
                                        {showDeletePopup && requestToDelete && (
                                            <div className="fixed inset-0 flex items-center justify-center z-20 overflow-y-auto">
                                                <div
                                                    className="absolute inset-0 bg-black opacity-50"
                                                    onClick={handleClosePopup}
                                                ></div>
                                                <div className="z-30 bg-white rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                                                    <DeleteConfirmation
                                                        title={t(
                                                            "reject course join request"
                                                        )}
                                                        body={t(
                                                            "reject course join request confirmation",
                                                            {
                                                                firstName:
                                                                    participant.firstName,
                                                                lastName:
                                                                    participant.lastName,
                                                            }
                                                        )}
                                                        actionLabel={t(
                                                            "button.reject"
                                                        )}
                                                        handleSubmit={
                                                            handleDeleteJoinRequest
                                                        }
                                                        closePopup={
                                                            handleClosePopup
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p>{t("no course join requests")}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
