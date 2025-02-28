"use client";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import EditIcon from "../icons/edit-icon";
import { useSession } from "next-auth/react";
import {
    checkCourseJoinRequestExists,
    createCourseJoinRequest,
    deleteCourseJoinRequest,
} from "@/db/queries/courses";
import { useEffect, useState } from "react";

interface CourseCardProps {
    id: number;
    name: string;
    image?: string;
    imageAlt?: string;
}

interface ClientVariantProps extends CourseCardProps {
    variant: "client";
    enrolled: boolean;
}

interface AdminVariantProps extends CourseCardProps {
    description: string | null;
    handleEditButtonClick: (courseId: number) => void;
    variant: "admin";
}

export default function CourseCard(
    props: ClientVariantProps | AdminVariantProps
) {
    const router = useRouter();
    const { data: session } = useSession();
    const participantId = session?.user.id;
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [error, setError] = useState("");
    const [requestExists, setRequestExists] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const courseLink =
        props.variant === "admin"
            ? `/admin/courses/${props.id}`
            : `/courses/${props.id}`;

    useEffect(() => {
        const checkRequestStatus = async () => {
            if (!participantId) return;
            try {
                const exists = await checkCourseJoinRequestExists(
                    props.id,
                    parseInt(participantId)
                );
                setRequestExists(exists);
            } catch (error) {
                console.error("Error checking request status:", error);
            }
        };

        checkRequestStatus();
    }, [participantId, props.id]);

    const handleEnrollClick = async () => {
        if (!participantId) return;
        setIsEnrolling(true);

        try {
            if (requestExists) {
                setError("Enrollment request already exists.");
                setIsEnrolling(false);
                return;
            }

            await createCourseJoinRequest(props.id, parseInt(participantId));
            console.log("Join request successfully sent");
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
            await deleteCourseJoinRequest(props.id, parseInt(participantId));
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
        <div className="flex flex-col items-center justify-center relative">
            <Card
                className="w-full relative cursor-pointer flex flex-col gap-4"
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(courseLink);
                }}
            >
                <CardHeader>
                    <CardTitle
                        className={twMerge(
                            props.variant === "admin"
                                ? "px-6 sm:px-4 md:px-4"
                                : ""
                        )}
                    >
                        {props.name}
                    </CardTitle>
                </CardHeader>
                {props.image && (
                    <Image
                        src={props.image}
                        width={200}
                        height={200}
                        alt={props.imageAlt || `${props.name} Course Image`}
                    />
                )}
                {props.variant == "client" && (
                    <>
                        <div className="text-red-500">{error}</div>
                        {props.enrolled ? (
                            <Button
                                asChild
                                className="bg-primary-green hover:bg-[#045B47] text-white rounded-full w-full font-semibold text-base"
                            >
                                <Link href={`/courses/${props.id}`}>
                                    View Course
                                </Link>
                            </Button>
                        ) : requestExists ? (
                            <div className="w-full flex flex-col gap-2 pb-4">
                                <Button
                                    asChild
                                    className="hover:bg-primary-green border-primary-green text-primary-green hover:text-white rounded-full w-full font-semibold text-base"
                                    variant="outline"
                                >
                                    <Link href={`/courses/${props.id}`}>
                                        Details
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full font-semibold text-base rounded-full px-4 py-2 h-9 border-destructive-hover text-destructive-text hover:bg-destructive-hover hover:text-destructive-text"
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
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-2 pb-4">
                                <Button
                                    asChild
                                    className="hover:bg-primary-green border-primary-green text-primary-green hover:text-white rounded-full w-full font-semibold text-base"
                                    variant="outline"
                                >
                                    <Link href={`/courses/${props.id}`}>
                                        Details
                                    </Link>
                                </Button>
                                <Button
                                    className="bg-primary-green hover:bg-[#045B47] text-white rounded-full w-full font-semibold text-base"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEnrollClick();
                                    }}
                                    disabled={isEnrolling}
                                >
                                    {isEnrolling ? "Enrolling..." : "Enroll"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
                {props.variant == "admin" && (
                    <CardContent>
                        <p>{props.description}</p>
                    </CardContent>
                )}

                {props.variant == "admin" && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            props.handleEditButtonClick(props.id);
                        }}
                        className="absolute right-5 top-4"
                    >
                        <EditIcon />
                    </button>
                )}

                {props.variant == "admin" && (
                    <Link
                        href={`/admin/courses/${props.id}`}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="48"
                            viewBox="0 0 50 48"
                            fill="none"
                        >
                            <path
                                d="M19.1364 10L33.4546 24L19.1364 38"
                                stroke="black"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                )}
            </Card>
        </div>
    );
}
