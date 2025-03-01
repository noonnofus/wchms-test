"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ExercisePage({ isCorrect }: { isCorrect: boolean }) {
    const router = useRouter();

    useEffect(() => {
        console.log(isCorrect);
    }, [isCorrect]);

    return (
        <div className="flex flex-col items-center h-screen overflow-hidden p-4">
            <Image
                src={isCorrect ? "/confetti-logo.png" : "/logo.png"}
                width={isCorrect ? 150 : 100}
                height={isCorrect ? 150 : 100}
                alt="Exercise result icon"
                className="mb-4"
            />
            {isCorrect ? (
                <div className="text-[#068973] text-center">
                    <p className="font-semibold text-[32px]">
                        Congratulations!
                    </p>
                    <p className="text-base mb-4">
                        Great work completing the exercise
                    </p>
                </div>
            ) : (
                <div className="text-[#068973] text-center mb-4">
                    <p className="font-semibold text-[32px]">Close!</p>
                    <p className="text-base">Try again next time!</p>
                </div>
            )}
            <div className="flex gap-4 mt-4">
                <Button
                    onClick={() => router.push("/courses")}
                    variant="outline"
                    className="border-[#068973] text-[#068973] hover:bg-[#068973] hover:text-white rounded-full w-full font-semibold text-base"
                >
                    Exit Exercise
                </Button>
                <Button
                    onClick={() => router.push("/next-question")}
                    className="bg-[#068973] hover:bg-[#045B47] text-white rounded-full w-full font-semibold text-base"
                >
                    Next Question
                </Button>
            </div>
        </div>
    );
}
