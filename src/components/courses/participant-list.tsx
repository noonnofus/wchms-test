"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Participant } from "@/db/schema/participants";
import DeleteConfirmation from "../shared/delete-confirmation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ParticipantList(props: {
    participants: Participant[];
    courseId?: number;
    removeParticipantLocally?: (userId: number) => void;
}) {
    const { t } = useTranslation();
    const { id } = useParams();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [participantToRemove, setParticipantToRemove] =
        useState<Participant | null>(null);

    const handleRemoveButtonClick = (participant: Participant) => {
        setParticipantToRemove(participant);
        setShowDeletePopup(true);
    };

    const handleRemoveParticipant = async () => {
        if (!participantToRemove) return;
        try {
            const response = await fetch("/api/courses/participants/remove", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: participantToRemove.id,
                    courseId: id,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to delete");

            if (props.removeParticipantLocally) {
                props.removeParticipantLocally(participantToRemove.id);
            }
        } catch (error) {
            console.error("Failed to remove participant from course", error);
        } finally {
            setShowDeletePopup(false);
            setParticipantToRemove(null);
        }
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
    };
    return (
        <div className="flex flex-col items-center w-full">
            <Card className="overflow-hidden">
                <CardHeader className="w-full py-4 md:py-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-left text-2xl md:text-[32px]">
                            Participant List
                        </CardTitle>
                        {props.courseId ? (
                            <Link
                                href={`/admin/courses/${props.courseId}/participants`}
                            >
                                <p className="text-primary-green text-sm md:text-xl font-semibold">
                                    {t("view all")}
                                </p>
                            </Link>
                        ) : (
                            <Link href={`/courses/${id}/participants`}>
                                <p className="text-primary-green text-sm md:text-xl font-semibold">
                                    {t("view all")}
                                </p>
                            </Link>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="overflow-x-auto w-full">
                    <div className="flex overflow-x-auto min-w-max space-x-4">
                        {props.participants.length
                            ? props.participants.map((participant) => {
                                  return (
                                      <div
                                          className="flex flex-col w-40 md:w-52 h-auto border-2 border-primary-green rounded-lg p-2 md:p-4"
                                          key={
                                              participant.id +
                                              participant.firstName
                                          }
                                      >
                                          <p className="text-lg md:text-2xl font-semibold capitalize">{`${participant.firstName} ${participant.lastName[0]}.`}</p>
                                          <div className="my-2 md:my-4 self-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-gray-300 flex flex-col items-center justify-center">{`${participant.firstName[0]}${participant.lastName[0]}`}</div>
                                          <Button
                                              asChild
                                              key={
                                                  participant.id +
                                                  participant.firstName +
                                                  "vp_button"
                                              }
                                              className=" bg-primary-green hover:bg-[#045B47] font-semibold text-sm md:text-base"
                                          >
                                              <Link href="#">
                                                  {t("view profile")}
                                              </Link>
                                          </Button>

                                          {props.courseId ? (
                                              <Button
                                                  key={
                                                      participant.id +
                                                      participant.firstName +
                                                      "remove_action"
                                                  }
                                                  onClick={() =>
                                                      handleRemoveButtonClick(
                                                          participant
                                                      )
                                                  }
                                                  className="mt-2 bg-destructive-red text-destructive-text hover:bg-destructive-hover font-semibold text-xs md:text-base"
                                              >
                                                  {t("remove from course")}
                                              </Button>
                                          ) : (
                                              ""
                                          )}
                                      </div>
                                  );
                              })
                            : "No participants registered"}
                    </div>
                </CardContent>
            </Card>
            {showDeletePopup && participantToRemove && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title={t("before you remove")}
                            body={t("remove participant confirmation", {
                                firstName: participantToRemove.firstName,
                                lastName: participantToRemove.lastName,
                            })}
                            actionLabel={t("remove")}
                            handleSubmit={handleRemoveParticipant}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
