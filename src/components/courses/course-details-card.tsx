"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    createCourseJoinRequest,
    checkCourseJoinRequestExists,
    deleteCourseJoinRequest,
} from "@/db/queries/courses";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { CourseFull } from "@/db/schema/course";
import { getSignedUrlFromFileKey } from "@/lib/s3";

interface CourseDetailsProps {
    course: CourseFull;
    variant: "client" | "admin";
    enrolled?: boolean;
    editAction?: () => void;
}

export default function CourseDetailsCard(props: CourseDetailsProps) {
    const id = useParams().id;
    const courseId = Array.isArray(id) ? id[0] : id || "";
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { data: session } = useSession();
    const participantId = session?.user.id;
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [error, setError] = useState("");
    const [requestExists, setRequestExists] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const fetchData = async () => {
        try {
            props.course.fileKey !== null
                ? setImageUrl(
                      await getSignedUrlFromFileKey(props.course.fileKey)
                  )
                : null;

            if (participantId) {
                const exists = await checkCourseJoinRequestExists(
                    parseInt(id as string),
                    parseInt(participantId)
                );
                setRequestExists(exists);
            }
        } catch (error) {
            console.error(
                "Error fetching course image or request status",
                error
            );
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId, id, participantId]);

    const handleEnrollClick = async () => {
        if (!participantId) return;
        setIsEnrolling(true);

        try {
            if (requestExists) {
                setError("Enrollment request already exists.");
                setIsEnrolling(false);
                return;
            }

            await createCourseJoinRequest(
                parseInt(courseId),
                parseInt(participantId)
            );
            console.log("Join request successfully sent");
            await fetchData();
        } catch (error) {
            console.error("Error enrolling in course:", error);
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleRemoveClick = async () => {
        if (!participantId) return;
        setIsRemoving(true);
        setError("");
        try {
            await deleteCourseJoinRequest(
                parseInt(courseId),
                parseInt(participantId)
            );
            console.log("Join request successfully deleted");
            setRequestExists(false);
        } catch (error) {
            console.error("Error removing request:", error);
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <Card className="flex flex-col gap-2 md:gap-8">
                <CardHeader>
                    <CardTitle>{props.course.title}</CardTitle>
                </CardHeader>
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        width={200}
                        height={200}
                        alt={`${props.course.title} course image`}
                        className="rounded-lg my-2"
                    />
                )}
                {props.variant === "client" &&
                    (props.enrolled ? (
                        <Button className="bg-primary-green text-white rounded-full w-full font-semibold text-base hover:bg-[#045B47]">
                            Join Session
                        </Button>
                    ) : requestExists ? (
                        <Button
                            variant="outline"
                            className="w-full md:text-xl py-2 md:py-4 rounded-full border-destructive-hover text-destructive-text hover:bg-destructive-hover hover:text-destructive-text"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveClick();
                            }}
                            disabled={isRemoving}
                        >
                            {isRemoving
                                ? "Removing..."
                                : "Remove Request to Join Course"}
                        </Button>
                    ) : (
                        <Button
                            className="w-full md:text-xl py-2 md:py-4 rounded-full bg-primary-green hover:bg-[#045B47] text-white font-semibold text-base"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEnrollClick();
                            }}
                            disabled={isEnrolling}
                        >
                            {isEnrolling ? "Enrolling..." : "Enroll"}
                        </Button>
                    ))}

                {props.variant == "admin" && (
                    <>
                        <div className="flex flex-col gap-2 md:gap-4 w-full">
                            <Button className="w-full md:text-xl py-2 md:py-4 rounded-full bg-primary-green text-white font-semibold text-base hover:bg-[#045B47]">
                                Launch Zoom
                            </Button>
                            <Button
                                onClick={props.editAction}
                                variant="outline"
                                className="w-full md:text-xl py-2 md:py-4 rounded-full border-primary-green text-primary-green font-semibold text-base hover:bg-primary-green hover:text-white"
                            >
                                Edit Course Details
                            </Button>
                        </div>
                    </>
                )}
                <CardContent>
                    <p>{props.course.description}</p>
                </CardContent>
            </Card>
        </div>
    );
}
