"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCourseImage, getUploadId } from "@/db/queries/courses";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface CourseDetailsProps {
    name: string;
    description: string;
    variant: "client" | "admin";
    enrolled?: boolean;
    editAction?: () => void;
}

export default function CourseDetailsCard(props: CourseDetailsProps) {
    const id = useParams().id;
    const courseId = Array.isArray(id) ? id[0] : id || "";

    const [imageUrl, setImageUrl] = useState<string>("/course-image.png");
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const uploadId = await getUploadId(parseInt(courseId, 10));
                if (uploadId) {
                    const fetchedImage = await fetchCourseImage(uploadId);
                    setImageUrl(fetchedImage || "/course-image.png");
                }
            } catch (error) {
                console.error("Error fetching course image", error);
                setImageUrl("/course-image.png");
            }
        };

        fetchImage();
    }, [courseId]);
    return (
        <div className="flex flex-col items-center">
            <Card className="flex flex-col gap-4">
                <CardHeader>
                    <CardTitle>{props.name}</CardTitle>
                </CardHeader>
                <Image
                    src={imageUrl}
                    width={200}
                    height={200}
                    alt={`${props.name} course image`}
                    className="rounded-lg"
                />
                {props.variant === "client" && !props.enrolled && (
                    <Button className="bg-primary-green text-white rounded-full w-full font-semibold text-base hover:bg-[#045B47]">
                        Join Session
                    </Button>
                )}

                {props.variant == "admin" && (
                    <>
                        <div className="flex flex-col gap-2 md:gap-4 w-full">
                            <Button className="bg-primary-green text-white rounded-full w-full font-semibold text-base hover:bg-[#045B47]">
                                Launch Zoom
                            </Button>
                            <Button
                                onClick={props.editAction}
                                variant="outline"
                                className="border-primary-green text-primary-green rounded-full w-full font-semibold text-base hover:bg-primary-green hover:text-white"
                            >
                                Edit Course Details
                            </Button>
                        </div>
                    </>
                )}
                <CardContent>
                    <p>{props.description}</p>
                </CardContent>
            </Card>
        </div>
    );
}
