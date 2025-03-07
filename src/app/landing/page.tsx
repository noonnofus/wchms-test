"use client";
import NextClass from "@/components/courses/next-class";
import BookIcon from "@/components/icons/book-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
    const [isComponentLoaded, setIsComponentLoaded] = useState(true);

    const handleComponentLoaded = () => {
        setIsComponentLoaded(true);
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <NextClass whenLoaded={handleComponentLoaded} />

            <div className="flex flex-col gap-4">
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-primary-green hover:bg-[#045B47]"
                >
                    <Link href="/courses">
                        <div className="flex flex-col items-center justify-center">
                            <BookIcon className="min-w-12 min-h-12" />
                            <p className="text-2xl md:text-3xl">Courses</p>
                        </div>
                    </Link>
                </Button>
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-homework-yellow hover:bg-[#E0A800]"
                >
                    <Link href="/homework">
                        <div className="flex flex-col items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                                className="min-w-12 min-h-12"
                            >
                                <path
                                    d="M22 10H12C9.79086 10 8 11.7909 8 14V36C8 38.2091 9.79086 40 12 40H34C36.2091 40 38 38.2091 38 36V26M35.1716 7.17157C36.7337 5.60948 39.2663 5.60948 40.8284 7.17157C42.3905 8.73367 42.3905 11.2663 40.8284 12.8284L23.6568 30H18L18 24.3431L35.1716 7.17157Z"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className="text-2xl md:text-3xl">Homework</p>
                        </div>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
