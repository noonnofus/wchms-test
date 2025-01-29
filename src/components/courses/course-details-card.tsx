"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import Image from "next/image";

export default function CourseDetailsCard(props: {
    name: string;
    description: string;
}) {
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
                <Button className="bg-primary-green text-white rounded-full w-full font-semibold text-base hover:bg-[#045B47]">
                    Start Session
                </Button>
                <CardContent>
                    <p>{props.description}</p>
                </CardContent>
            </Card>
        </div>
    );
}
