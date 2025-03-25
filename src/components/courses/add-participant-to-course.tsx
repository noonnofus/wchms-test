import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Participant } from "@/db/schema/participants";
import { getUnenrolledParticipants } from "@/db/queries/courses";
import { useTranslation } from "react-i18next";

export default function AddParticipantToCourse({
    courseId,
    handleClosePopup,
    onParticipantAdded,
}: {
    courseId: string;
    handleClosePopup: () => void;
    onParticipantAdded: () => void;
}) {
    const { t } = useTranslation();
    const [errors, setErrors] = useState({
        courseParticipants: "",
    });
    const [participants, setParticipants] = useState<Participant[] | null>(
        null
    );
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!courseId) return;
        const unenrolledParticipants = async () => {
            try {
                const data = await getUnenrolledParticipants(
                    parseInt(courseId)
                );
                setParticipants(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (courseId) unenrolledParticipants();
    }, [courseId]);

    const handleCheckboxChange = (id: number) => {
        setSelectedParticipants((prev) =>
            prev.includes(id)
                ? prev.filter((participantId) => participantId !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            for (const participantId of selectedParticipants) {
                const res = await fetch("/api/courses/participants/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: participantId,
                        courseId: courseId,
                    }),
                });

                if (!res.ok) {
                    setErrors({
                        courseParticipants: `Failed to add participant ${participantId}`,
                    });
                    return;
                }
            }
            onParticipantAdded();
            setSelectedParticipants([]);
            handleClosePopup();
        } catch (error) {
            console.error(error);
            setErrors({
                courseParticipants:
                    "An error occurred while adding participants",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-12 w-full h-full py-8 px-6 rounded-lg bg-white items-center justify-center overf">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                {t("add participant")}
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        {courseId && (
                            <div className="flex flex-col flex-1 gap-2">
                                <label htmlFor="courseParticipants">
                                    {t("participant", { count: 2 })}
                                </label>
                                {errors.courseParticipants && (
                                    <p className="text-red-500 text-sm">
                                        {errors.courseParticipants}
                                    </p>
                                )}
                                <div className="flex flex-col gap-2">
                                    {participants && participants.length > 0 ? (
                                        participants.map((participant) => (
                                            <div
                                                key={participant.id}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`participant-${participant.id}`}
                                                    checked={selectedParticipants.includes(
                                                        participant.id
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            participant.id
                                                        )
                                                    }
                                                    className="form-checkbox h-5 w-5"
                                                />
                                                <label
                                                    htmlFor={`participant-${participant.id}`}
                                                    className="text-lg"
                                                >
                                                    {participant.firstName}{" "}
                                                    {participant.lastName}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-lg">
                                            No participants to add
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Button
                    className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4"
                    disabled={
                        isLoading ||
                        selectedParticipants.length === 0 ||
                        participants?.length === 0
                    }
                >
                    {isLoading ? t("adding") : t("add")}
                </Button>
                <Button
                    onClick={handleClosePopup}
                    variant="outline"
                    className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold md:text-xl py-2 md:py-4"
                >
                    {t("button.cancel")}
                </Button>
            </form>
        </div>
    );
}
