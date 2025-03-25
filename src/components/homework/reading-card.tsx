import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface Recommendation {
    topic: string;
}

interface ReadingProps {
    difficulty: string;
    topicRecommendations: Recommendation[] | null;
}

export default function ReadingCard({
    difficulty,
    topicRecommendations,
}: ReadingProps) {
    const { t } = useTranslation();
    const [showTopicPopup, setShowTopicPopup] = useState(true);
    const [topic, setTopic] = useState<string | null>(null);
    const [topicLoading, setTopicLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<
        Recommendation[] | null
    >(null);
    const [readingQuestion, setReadingQuestion] = useState<string[] | null>(
        null
    );
    const [error, setError] = useState<string | null>();

    const router = useRouter();

    useEffect(() => {
        if (topicRecommendations) {
            setRecommendations(topicRecommendations);
        }
    }, [topicRecommendations]);

    useEffect(() => {
        const getReadingQuestion = async () => {
            if (topicLoading) {
                return;
            }

            const res = await fetch("/api/homework/reading", {
                method: "POST",
                body: JSON.stringify({
                    topic: topic,
                    level: difficulty,
                }),
                headers: new Headers({
                    "Content-Type": "application/json; charset=UTF-8",
                }),
            });
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            let result;

            try {
                const data = await res.json();
                console.log(data);

                result = await JSON.parse(data.result);
            } catch (e) {
                console.error(e);
                result = null;
                setError("Error while getting reading aloud passage. Please try again later.")
            }

            setReadingQuestion(result.reading);
        };

        getReadingQuestion();
    }, [showTopicPopup, topicLoading]);

    const handleCourseSelect = (selectedTopic: string) => {
        setTopic(selectedTopic);
    };

    const hanldeOnClick = () => {
        if (topic) {
            setShowTopicPopup(false);
        } else {
            setError(t("error.missingActivityTopic"));
        }
    };

    const handleExit = () => {
        router.push("/homework");
    };

    return (
        <div className="flex justify-center items-center">
            {showTopicPopup && (
                <div
                    className="absolute inset-0 flex justify-center items-center min-h-[800px] min-w-[360px] w-full h-full bg-black bg-opacity-50 z-50"
                    onClick={handleExit}
                >
                    <div
                        className="relative max-w-[1000px] w-full bg-white rounded-lg p-6 overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col justify-center items-center mt-4 gap-6">
                                <div className="flex flex-col justify-center items-center gap-4">
                                    <h1 className="font-medium text-3xl text-center text-primary-green text-left">
                                        {t("activity.readingPrompt")}
                                    </h1>
                                    <Input
                                        type="text"
                                        placeholder={t(
                                            "activity.readingInputPlaceholder"
                                        )}
                                        className="w-full py-6"
                                        value={topic || ""}
                                        onChange={(e) =>
                                            setTopic(e.target.value)
                                        }
                                    />
                                </div>
                                {recommendations ? (
                                    <div className="flex w-full justify-center item-center">
                                        <Select
                                            onValueChange={handleCourseSelect}
                                        >
                                            <SelectTrigger className="w-[300px]">
                                                <SelectValue placeholder="All Recommendations" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full w-[300px]">
                                                {recommendations.map(
                                                    (recommendation, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={
                                                                recommendation.topic
                                                            }
                                                            className="w-full w-[300px]"
                                                        >
                                                            <p className="overflow-hidden text-ellipsis w-full">
                                                                {
                                                                    t(recommendation.topic)
                                                                }
                                                            </p>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <Skeleton className="h-10 w-[300px] rounded-md" />
                                )}
                            </div>

                            {error && (
                                <p className="text-red-500 text-center">
                                    {t(error)}
                                </p>
                            )}

                            <div className="w-full flex flex-row justify-between gap-6 mb-2">
                                <Button
                                    variant="outline"
                                    className="w-full h-[45px] rounded-full bg-primary-green text-white hover:bg-[#045B47] hover:text-white font-semibold text-base md:text-xl py-4"
                                    onClick={() => {
                                        hanldeOnClick();
                                        setTopicLoading(false);
                                    }}
                                >
                                    {t("placeholder.selectTopic")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col justify-center items-center">
                <h1 className="font-semibold text-4xl text-center mb-4">
                    {t("activity.reading")}
                </h1>
                <div className="flex justify-center items-center w-full px-6 mb-8">
                    <span className="text-center">
                        {t("activity.readingInstructions")}
                    </span>
                </div>
                <Card className="p-8 w-full shadow-lg">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-black text-2xl font-bold text-center">
                            {topic}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="w-full flex flex-col items-center">
                        <form
                            className="w-full flex flex-col items-center"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleExit();
                            }}
                        >
                            {Array.isArray(readingQuestion) ? (
                                <div>
                                    {readingQuestion.map((reading, i) => (
                                        <span key={i}>{t(reading)} </span>
                                    ))}
                                </div>
                            ) : (
                                <Skeleton className="h-[150px] w-full rounded-md" />
                            )}
                            <Button
                                className="w-full mt-4 rounded-xl bg-primary-green hover:bg-[#046e5b]"
                                type="submit"
                            >
                                {t("button.backToHomework")}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
