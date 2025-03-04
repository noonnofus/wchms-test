import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

interface Recommendation {
    topic: string
}

interface ReadingProps {
    difficulty: string;
    topicRecommendations: Recommendation[] | null;
}

export default function ReadingCard({
    difficulty,
    topicRecommendations,
}: ReadingProps) {
    const [showTopicPopup, setShowTopicPopup] = useState(true);
    const [topic, setTopic] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
    const [error, setError] = useState<string | null>();

    const router = useRouter();

    useEffect(() => {
        // 2. Fetch to "api/homework" to get a reading aloud question with topic value && difficulty.
        if (topicRecommendations) {
            setRecommendations(topicRecommendations);
        }
    }, [showTopicPopup, topicRecommendations]);

    const handleCourseSelect = (selectedTopic: string) => {
        setTopic(selectedTopic);
    };

    const hanldeOnClick = () => {
        if (topic) {
            setShowTopicPopup(false);
        } else {
            setError("You must either type the topic or select it from Recommendation.")
        }
    };

    const handleExit = () => {
        router.push("/homework");
    }

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
                                    <h1 className="font-medium text-3xl text-center text-primary-green text-left">What would you like to read today?</h1>
                                    <Input
                                        type="text"
                                        placeholder="Enter any topic, ex. Christmas"
                                        className="w-full py-6"
                                        value={topic || ""}
                                        onChange={(e) => setTopic(e.target.value)}
                                    />
                                </div>

                                {recommendations ? (
                                    <Select onValueChange={handleCourseSelect}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Recommendations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {recommendations.map((recommendation, index) => (
                                                <SelectItem key={index} value={recommendation.topic}>
                                                    {recommendation.topic}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Skeleton className="h-10 w-full rounded-md" />
                                )}
                            </div>

                            {error && (
                                <p className="text-red-500 text-center">{error}</p>
                            )}

                            <div className="w-full flex flex-row justify-between gap-6 mb-2">
                                <Button
                                    variant="outline"
                                    className="w-full h-[45px] rounded-full bg-primary-green text-white hover:bg-[#045B47] hover:text-white font-semibold text-base md:text-xl py-4"
                                    onClick={hanldeOnClick}
                                >
                                    Select Topic
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col justify-center items-center">
                <h1 className="font-semibold text-4xl text-center mb-4">
                    Reading Aloud Exercise
                </h1>
                <div className="flex justify-center items-center w-full px-6 mb-8">
                    <span className="text-center">【Please read it out loud <span className="text-red-500">twice</span> as soon as possible】</span>
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
                            <span>
                                {/* Reading question here */}
                                埼玉県は、1962年から50年以上連続で雛人形の出荷額日本一を誇っています。
                                江戸時代、三代将軍家光が実施した日光東照宮の大改修で、全国から腕の良い
                                職人たちが集められました。当時、宿場町として栄えていた岩槻 (現 さいたま市
                                岩槻区)には、職人たちが住み着くようになります。
                                江戸時代に雛人形が流行したおかげで、幕末には人形が岩槻藩主の専売品にさ
                                れるほど重要な産業となり、今でも人形づくり日本一の町として受け継がれてい
                                ます。実に何百という工程を経て作られる人形ですが、今でも熟練の人形師が心
                                を込めて手作業しています。
                            </span>
                            <Button
                                className="w-full mt-4 rounded-xl bg-primary-green hover:bg-[#046e5b]"
                                type="submit"
                            >
                                Back to Homework
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}