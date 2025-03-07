"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Participant } from "@/db/schema/participants";

export default function ParticipantList(props: {
    participants: Participant[];
    courseId?: number;
}) {
    const { id } = useParams();
    return (
        <div className="flex flex-col items-center w-full h-full">
            <Card className="overflow-hidden mb-8">
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
                                    View All
                                </p>
                            </Link>
                        ) : (
                            <Link href={`/courses/${id}/participants`}>
                                <p className="text-primary-green text-sm md:text-xl font-semibold">
                                    View All
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
                                              <Link href="#">View Profile</Link>
                                          </Button>

                                          {props.courseId ? (
                                              <Button
                                                  asChild
                                                  key={
                                                      participant.id +
                                                      participant.firstName +
                                                      "remove_action"
                                                  }
                                                  className="mt-2 bg-destructive-red text-destructive-text hover:bg-destructive-hover font-semibold text-xs md:text-base"
                                              >
                                                  <Link href="#">
                                                      Remove From Course
                                                  </Link>
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
        </div>
    );
}
