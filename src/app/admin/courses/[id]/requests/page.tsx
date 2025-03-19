"use client";
import RequestCard from "@/components/courses/request-card";
import { getAllCourseJoinRequests } from "@/db/queries/courses";
import { CourseJoinRequest } from "@/db/schema/courseJoinRequests";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import { Participant } from "@/db/schema/participants";

export default function Requests() {
    const { id } = useParams();
    const [courseJoinRequests, setCourseJoinRequests] = useState<
        CourseJoinRequest[] | null
    >(null);
    const [requestIdToDelete, setRequestIdToDelete] = useState<number | null>(
        null
    );
    const [participantRequestToDelete, setParticipantRequestToDelete] =
        useState<Participant | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [refreshRequests, setRefreshRequests] = useState(false);

    useEffect(() => {
        const fetchJoinRequests = async () => {
            try {
                if (!id) return;
                const requests = await getAllCourseJoinRequests(
                    parseInt(id as string)
                );
                if (requests) setCourseJoinRequests(requests);
            } catch (error) {
                console.error(error);
                console.error("Error fetching ");
            }
        };
        fetchJoinRequests();
    }, [id, refreshRequests]);

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
            const deleteResponse = await fetch("/api/requests/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestId: request.id }),
            });

            const deleteData = await deleteResponse.json();
            if (!deleteResponse.ok)
                throw new Error(deleteData.error || "Failed to delete request");

            setRefreshRequests((prev) => !prev);
        } catch (error) {
            console.error("Error approving request", error);
        }
    };

    const handleRejectRequest = (
        requestId: number,
        participant: Participant
    ) => {
        setShowDeletePopup(true);
        setRequestIdToDelete(requestId);
        setParticipantRequestToDelete(participant);
    };

    const handleDeleteJoinRequest = async (e: React.FormEvent) => {
        if (!requestIdToDelete) return;
        try {
            e.preventDefault();
            const response = await fetch("/api/requests/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestId: requestIdToDelete }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to delete");
            setRefreshRequests((prev) => !prev);
        } catch (error) {
            console.error("Error deleting request: ", error);
        } finally {
            setShowDeletePopup(false);
            setRequestIdToDelete(null);
        }
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setRequestIdToDelete(null);
    };

    return (
        <div className="flex flex-col gap-10 w-full items-center">
            <h1 className="font-semibold text-4xl text-center">
                Course Enrollment Requests
            </h1>
            <div className="w-full flex flex-col items-center gap-4">
                {courseJoinRequests && courseJoinRequests.length > 0
                    ? courseJoinRequests.map((request) => (
                          <RequestCard
                              key={request.id}
                              request={request}
                              onReject={handleRejectRequest}
                              onApprove={handleApproveRequest}
                          />
                      ))
                    : null}
            </div>
            {showDeletePopup && requestIdToDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title="Reject Course Join Request"
                            body={`Are you sure you want to reject ${participantRequestToDelete?.firstName} ${participantRequestToDelete?.lastName}'s request? This action cannot be undone.`}
                            actionLabel="REJECT"
                            handleSubmit={handleDeleteJoinRequest}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
