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

export default function RequestOverviewCard({
    requests,
}: {
    requests: CourseJoinRequest[];
}) {
    const { id } = useParams();
    const [courseJoinRequests, setCourseJoinRequests] =
        useState<CourseJoinRequest[]>();
    const [participants, setParticipants] = useState<Participant[]>([]);

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
    }, [requests]);

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
    }, [id]);

    return (
        <div className="flex flex-col items-center w-full h-full">
            <Card className="w-full max-w-none overflow-hidden mb-8">
                <CardHeader className="w-full py-4 md:py-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-left text-2xl md:text-[32px]">
                            Course Enrollment Requests
                        </CardTitle>

                        <Link href={`/admin/courses/${id}/requests`}>
                            <p className="text-primary-green text-sm md:text-xl font-semibold">
                                View All
                            </p>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="overflow-x-auto w-full h-full">
                    <div className="flex overflow-x-auto min-w-max space-x-4">
                        {participants.length > 0 ? (
                            participants.map((participant) => (
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
                                            <Button className="w-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-sm md:text-base">
                                                <Check />
                                            </Button>
                                            <Button className="w-full rounded-full bg-destructive-red text-destructive-text hover:bg-destructive-hover font-semibold text-sm md:text-base">
                                                <CloseIcon />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No participants registered</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
