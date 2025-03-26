"use client";

import { useEffect } from "react";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ArithemeticCard from "@/components/homework/arithemetic-card";
import ReadingCard from "@/components/homework/reading-card";
import PhysicalCard from "@/components/homework/physical-card";
import { redirect } from "next/navigation";
import { getLatestPhysicalMaterial } from "@/db/queries/courses";

interface Recommendation {
    topic: string;
}

interface MathQuestions {
    question: string;
    answer: string;
}

export default function ActivityPage() {
    const [correctCount, setCorrectCount] = useState(0);
    const [recommendations, setRecommendations] = useState<
        Recommendation[] | null
    >(null);
    const [mathQuestions, setMathQuestions] = useState<MathQuestions[] | null>(
        null
    );
    const [currentQuestion, setCurrentQuestion] = useState(0);
    // const [loading, setLoading] = useState(false);
    const [physicalUrl, setPhysicalUrl] = useState<string | null>(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activity = pathname.split("/").pop();
    const difficulty = searchParams.get("difficulty");

    if (!activity || !difficulty) {
        redirect("/homework");
    }

    const getMathQuestions = async () => {
        const res = await fetch("/api/homework/arithmetics", {
            method: "POST",
            body: JSON.stringify({
                level: difficulty,
            }),
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            }),
        });
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        try {
            const data = await res.json();
            return await JSON.parse(data.result);
        } catch (e) {
            console.error(e);
        }
    };

    const handleNext = () => {
        if (mathQuestions && currentQuestion < mathQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            if (activity === "arithmetic") {
                const data = await getMathQuestions();
                if (data) {
                    setMathQuestions(data.questions);
                }
            }
        };

        fetchQuestions();
    }, [activity, difficulty]);

    useEffect(() => {
        const generateTopic = async () => {
            if (activity === "reading") {
                const res = await fetch(
                    `/api/homework/reading?level=${encodeURIComponent(difficulty)}`,
                    {
                        method: "GET",
                        headers: new Headers({
                            "Content-Type": "application/json; charset=UTF-8",
                        }),
                    }
                );
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                const topics = JSON.parse(data.result).topics.map(
                    (t: string) => t
                );

                setRecommendations(topics);
            } else {
                return;
            }
        };

        generateTopic();
    }, [activity, difficulty]);

    useEffect(() => {
        const getVideoUrl = async () => {
            if (activity === "physical") {
                const res = await getLatestPhysicalMaterial();
                const url = res[0].url;
                if (url !== null) {
                    setPhysicalUrl(url);
                } else {
                    setPhysicalUrl(
                        "No available video for you, please try again later."
                    );
                }
            }
        };

        getVideoUrl();
    }, [activity, difficulty]);

    const activityComponents: Record<string, React.ReactNode> = {
        arithmetic: (
            <ArithemeticCard
                question={
                    mathQuestions
                        ? mathQuestions[currentQuestion].question
                        : null
                }
                answer={
                    mathQuestions ? mathQuestions[currentQuestion].answer : null
                }
                currentIndex={currentQuestion}
                totalQuestions={mathQuestions ? mathQuestions.length : 15}
                correctCount={correctCount}
                setCorrectCount={setCorrectCount}
                onNext={handleNext}
            />
        ),
        reading: (
            <ReadingCard
                difficulty={difficulty}
                topicRecommendations={recommendations}
            />
        ),
        physical: <PhysicalCard videoUrl={physicalUrl} />,
    };

    return (
        activityComponents[activity] || (
            <p className="text-center">Invalid activity</p>
        )
    );
}
