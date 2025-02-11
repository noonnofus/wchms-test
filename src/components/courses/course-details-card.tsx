"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import Image from "next/image";

interface CourseDetailsProps {
    name: string;
    description: string;
    variant: "client" | "admin";
}

export default function CourseDetailsCard(props: CourseDetailsProps) {
    return (
        <div className="flex flex-col items-center">
            <Card>
                <CardHeader>
                    <CardTitle>{props.name}</CardTitle>
                </CardHeader>
                <Image
                    src="/course-image.png"
                    width={200}
                    height={200}
                    alt="Picture of snake"
                    className="mb-2"
                />
                {props.variant == "client" && (
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
