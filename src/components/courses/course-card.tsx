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
import { type CourseWithImage } from "@/app/admin/courses/page";
import { type CourseListWithImage } from "@/app/courses/page";
import DeleteIcon from "../icons/delete-icon";

interface CourseCardProps {
    //Shared props
}

interface ClientVariantProps extends CourseCardProps {
    variant: "client";
    enrolled: boolean;
    course: CourseListWithImage;
}

interface AdminVariantProps extends CourseCardProps {
    handleEditButtonClick: (courseId: number) => void;
    handleDeleteButtonClick: (course: CourseWithImage) => void;
    variant: "admin";
    course: CourseWithImage;
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
            ? `/admin/courses/${props.course.id}`
            : `/courses/${props.course.id}`;

    //TODO: this needs to be changed, it makes a POST request per course card for participants
    const fetchData = async () => {
        if (!participantId) return;
        try {
            const exists = await checkCourseJoinRequestExists(
                props.course.id,
                parseInt(participantId)
            );
            setRequestExists(exists);
        } catch (error) {
            console.error("Error checking request status:", error);
        }
    };

    useEffect(() => {
        props.variant === "admin" ? null : fetchData();
    }, [participantId]);

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
                props.course.id,
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
                props.course.id,
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
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <Card
                className="relative w-full cursor-pointer flex flex-col gap-4 py-6"
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
                        {props.course.title}
                    </CardTitle>
                </CardHeader>
                {props.course.imageUrl && (
                    <Image
                        src={props.course.imageUrl}
                        width={200}
                        height={200}
                        alt={`${props.course.title} Course Image`}
                        className="rounded-lg sm:w-[300px] lg:w-[400px] h-[200px] object-cover object-center"
                    />
                )}
                {props.variant == "client" && (
                    <>
                        <div className="text-red-500">{error}</div>
                        {props.enrolled ? (
                            <Button
                                asChild
                                className="w-full md:text-xl py-2 md:py-4 rounded-full bg-primary-green hover:bg-[#045B47] text-white font-semibold text-base"
                            >
                                <Link href={`/courses/${props.course.id}`}>
                                    View Course
                                </Link>
                            </Button>
                        ) : requestExists ? (
                            <div className="w-full h-full flex flex-col gap-2 md:gap-6">
                                <Button
                                    asChild
                                    className="w-full md:text-xl py-2 md:py-4 rounded-full hover:bg-primary-green border-primary-green text-primary-green hover:text-white font-semibold text-base"
                                    variant="outline"
                                >
                                    <Link href={`/courses/${props.course.id}`}>
                                        Details
                                    </Link>
                                </Button>
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
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-2 pb-4">
                                <Button
                                    asChild
                                    className="w-full md:text-xl py-2 md:py-4 rounded-full hover:bg-primary-green border-primary-green text-primary-green hover:text-white font-semibold text-base"
                                    variant="outline"
                                >
                                    <Link href={`/courses/${props.course.id}`}>
                                        Details
                                    </Link>
                                </Button>
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
                            </div>
                        )}
                    </>
                )}
                {props.variant == "admin" && (
                    <CardContent>
                        <p>{props.course.description}</p>
                    </CardContent>
                )}

                {props.variant == "admin" && (
                    <div className="absolute right-[3%] top-[5%] flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                props.handleEditButtonClick(props.course.id);
                            }}
                        >
                            <EditIcon />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                props.handleDeleteButtonClick(props.course);
                            }}
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                )}

                {props.variant == "admin" && (
                    <Link
                        href={`/admin/courses/${props.course.id}`}
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
