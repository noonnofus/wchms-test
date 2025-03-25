"use client";
import { useEffect, useState } from "react";
import { getParticipantById } from "@/db/queries/participants";
import { Participant } from "@/db/schema/participants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Profile() {
    const { t } = useTranslation();
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [participantId, setParticipantId] = useState<string | null>(null);

    const fetchData = async (id: string) => {
        try {
            const participantData = await getParticipantById(parseInt(id));
            setParticipant(participantData);
        } catch (error) {
            console.error("Error fetching participant data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const id = sessionStorage.getItem("participantId");
        if (id) {
            setParticipantId(id);
            fetchData(id);
        } else {
            setIsLoading(false);
        }

        return () => {
            sessionStorage.removeItem("participantId");
        };
    }, []);

    if (!participantId) {
        return (
            <div className="flex flex-col gap-4 items-center">
                <p className="font-semibold text-xl">{t("no profile")}</p>
                <Button
                    variant="outline"
                    className="w-full h-[45px] rounded-full bg-primary-green text-white hover:bg-[#045B47] hover:text-white font-semibold text-base md:text-xl py-4"
                >
                    <Link href={"/"}>{t("button.backToHome")}</Link>
                </Button>
            </div>
        );
    }

    const calculateAge = (dob: Date) => {
        const today = new Date();
        const birthDate = new Date(dob);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };

    if (!participant) return;
    const age = calculateAge(participant.dateOfBirth);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <p>{t("loading.profile")}</p>
            </div>
        );
    }

    return (
        <main className="relative flex flex-col gap-10 w-full items-center h-full">
            {/* Profile Content */}
            <div className="flex flex-col items-center">
                <h1 className="font-semibold text-2xl md:text-4xl text-center">
                    <span className="capitalize">
                        {t("users profile", {
                            firstName: participant.firstName,
                            lastName: participant.lastName,
                        })}
                    </span>
                </h1>
                <p className="text-base md:text-xl font-semibold text-[#6C757D]">
                    {t("participant")}
                </p>
            </div>

            <div className="flex w-24 h-24 md:w-40 md:h-40 text-2l md:text-3xl rounded-full bg-gray-200 items-center justify-center uppercase">
                {`${participant?.firstName[0]}${participant?.lastName[0]}`}
            </div>

            <div className="flex flex-col gap-4 text-lg">
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">{t("name")}: </p>
                    <p>
                        {participant.firstName} {participant.lastName}
                    </p>
                </div>
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">{t("age")}:</p>
                    <p>{t("ageDisplay", { age })}</p>
                </div>
                <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">{t("gender")}:</p>
                    <p>{t(`${participant?.gender?.toLowerCase()}`)}</p>
                </div>
            </div>
        </main>
    );
}
