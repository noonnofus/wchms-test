"use client";
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

export default function CourseCard(props: {
    id: string;
    name: string;
    image?: string;
    imageAlt?: string;
    enrolled: boolean;
}) {
    return (
        <div className="flex flex-col items-center">
            <Card className="w-full pb-4">
                <CardHeader>
                    <CardTitle>{props.name}</CardTitle>
                </CardHeader>
                {props.image && (
                    <Image
                        src={props.image}
                        width={200}
                        height={200}
                        alt={props.imageAlt || `${props.name} Course Image`}
                        className="mb-2"
                    />
                )}
                {props.enrolled ? (
                    <Button
                        asChild
                        className="bg-primary-green hover:bg-[#045B47] text-white rounded-full w-full font-semibold text-base"
                    >
                        <Link href="/courses/[id]" as={`/courses/${props.id}`}>
                            View Course
                        </Link>
                    </Button>
                ) : (
                    <>
                        <Button
                            asChild
                            className="hover:bg-primary-green border-primary-green text-primary-green hover:text-white rounded-full w-full font-semibold text-base"
                            variant="outline"
                        >
                            <Link
                                href="/courses/[id]"
                                as={`/courses/${props.id}`}
                            >
                                Details
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className="mt-2 bg-primary-green hover:bg-[#045B47] text-white rounded-full w-full font-semibold text-base"
                        >
                            <Link href="#">Enroll</Link>
                        </Button>
                    </>
                )}
            </Card>
        </div>
    );
}
