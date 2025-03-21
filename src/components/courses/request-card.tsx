"use client";
import { CourseJoinRequest } from "@/db/schema/courseJoinRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { getParticipantById } from "@/db/queries/participants";
import { Participant } from "@/db/schema/participants";
import { useTranslation } from "react-i18next";

export default function RequestCard({
    request,
    onReject,
    onApprove,
}: {
    request: CourseJoinRequest;
    onReject: (requestId: number, participant: Participant) => void;
    onApprove: (request: CourseJoinRequest, participant: Participant) => void;
}) {
    const [participant, setParticipant] = useState<Participant | null>(null);
    const { t } = useTranslation();
    useEffect(() => {
        if (!request || !request.participantId) return;
        const fetchParticipant = async () => {
            try {
                const participantData = await getParticipantById(
                    request.participantId
                );
                setParticipant(participantData);
            } catch (error) {
                console.error("Error fetching participant data", error);
            }
        };
        fetchParticipant();
    }, [request?.participantId]);

    return (
        <Card className="w-full flex flex-row">
            <CardHeader className="w-full py-4 md:py-6">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-left text-2xl md:text-[32px]">
                        {participant?.firstName} {participant?.lastName}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="overflow-x-auto w-full">
                <div className="flex flex-row gap-2 items-center justify-between">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!request) return;
                            if (!participant) return;
                            onApprove(request, participant);
                        }}
                        className="w-full h-full font-semibold md:text-xl py-2 md:py-4 rounded-full bg-primary-green text-white"
                    >
                        {t("button.approve")}
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!request) return;
                            if (!participant) return;
                            onReject(request.id, participant);
                        }}
                        className="w-full h-full font-semibold md:text-xl py-2 md:py-4 rounded-full bg-destructive-red border border-destructive-hover text-destructive-text hover:bg-destructive-hover hover:text-destructive-text"
                    >
                        {t("button.reject")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
