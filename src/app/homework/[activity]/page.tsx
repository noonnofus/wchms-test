"use client";

import { useEffect } from "react";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ArithemeticCard from "@/components/homework/arithemetic-card";
import ReadingCard from "@/components/homework/reading-card";
import PhysicalCard from "@/components/homework/physical-card";
import { redirect } from 'next/navigation'

interface Recommendation {
    topic: string;
}

// video URL for physical activity to test it.
const url = "https://www.youtube.com/watch?v=0xfDmrcI7OI";

export default function ActivityPage() {
    const [correctCount, setCorrectCount] = useState(0);
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [loading, setLoading] = useState(false);

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

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    useEffect(() => {
        // Fetch to get arithemetic questions to "api/homework" with activity type & difficulty

        // const topic = activity === "arithemetic" ? "mathematics" : reco[Math.floor(Math.random() * reco.length)];

        // const getArithmeticQuestions = async () => {
        //     await fetch('/api/homework', {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             topic: topic,
        //             level: difficulty,
        //         }),
        //         headers: new Headers({
        //             'Content-Type': 'application/json; charset=UTF-8'
        //         })
        //     })
        //         .then()
        // }

        // getArithmeticQuestions();

        const topicGenerate = async () => {

            const res = await fetch(`/api/homework/reading?level=${encodeURIComponent(difficulty)}`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8'
                })
            })
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();

            const topics = JSON.parse(data.result).topics.map((t: string) => t);

            setRecommendations(topics);
        }

        topicGenerate()
    }, [difficulty])

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
        reading: <ReadingCard difficulty={difficulty} topicRecommendations={recommendations} />,
        physical: <PhysicalCard videoUrl={url} />,
    };

    return activityComponents[activity] || <p className="text-center">Invalid activity</p>;
}