"use client";

import { useEffect } from "react";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ArithemeticCard from "@/components/homework/arithemetic-card";
import ReadingCard from "@/components/homework/reading-card";
import PhysicalCard from "@/components/homework/physical-card";
import { redirect } from 'next/navigation'

// topic recommendations for testing
const reco = [
    "Christmas",
    "Fairy tales",
    "Coffee",
    "Chang Seung",
]

export default function ActivityPage() {
    const [correctCount, setCorrectCount] = useState(0);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activity = pathname.split("/").pop();
    const difficulty = searchParams.get("difficulty");

    if (!activity || !difficulty) {
        redirect('/homework');
    }

    const generateMockQuestions = () => {
        return Array.from({ length: 15 }, () => {
            const num1 = Math.floor(Math.random() * 50) + 1;
            const num2 = Math.floor(Math.random() * 50) + 1;
            return {
                question: `${num1} + ${num2}`,
                answer: (num1 + num2).toString(),
            };
        });
    };

    const [questions] = useState(generateMockQuestions());
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    useEffect(() => {
        // Fetch to get arithemetic questions to "api/homework" with activity type & difficulty
    }, [activity, difficulty])

    const activityComponents: Record<string, React.ReactNode> = {
        arithemetic: (
            <ArithemeticCard
                question={questions[currentQuestion].question}
                answer={questions[currentQuestion].answer}
                currentIndex={currentQuestion}
                totalQuestions={questions.length}
                correctCount={correctCount}
                setCorrectCount={setCorrectCount}
                onNext={handleNext}
            />
        ),
        reading: <ReadingCard difficulty={difficulty} topicRecommendations={reco} />,
        physical: <PhysicalCard />,
    };

    return activityComponents[activity] || <p className="text-center">Invalid activity</p>;
}