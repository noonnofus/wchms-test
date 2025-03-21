import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface PhysicalProps {
    videoUrl: string | null;
}

export default function PhysicalCard({ videoUrl }: PhysicalProps) {
    const { t } = useTranslation();
    const [videoTitle, setVideoTitle] = useState("");
    const [videoId, setVideoId] = useState("");
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        console.log(videoUrl);
        const id = videoUrl?.split("v=")[1]?.split("&")[0];
        if (videoUrl !== null && id) {
            setVideoId(id);
            fetch(
                `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
            )
                .then((res) => res.json())
                .then((data) => setVideoTitle(data.title))
                .catch((err) =>
                    console.error("Error fetching video title:", err)
                );
        } else {
            setError(videoUrl);
        }
    }, [videoUrl]);

    const handleSubmit = () => {
        router.push("/homework");
    };

    return (
        <div className="flex justify-center items-center w-full md:px-4">
            <div className="flex flex-col justify-center items-center w-full max-w-6xl gap-4">
                <h1 className="font-semibold text-4xl text-center">
                    {t("activity.physical")}
                </h1>
                <div className="flex flex-col items-center w-full">
                    <Card className="md:p-8 w-full max-w-6xl shadow-lg">
                        <CardHeader className="space-y-2">
                            <CardTitle className="text-black text-2xl font-bold text-center">
                                {videoTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="w-full flex flex-col items-center">
                            {videoId ? (
                                <div className="w-full max-w-[1200px]">
                                    <iframe
                                        className="w-full aspect-video rounded-lg shadow-lg"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : error ? (
                                <p className="text-red-500 text-center">
                                    {error}
                                </p>
                            ) : (
                                <Skeleton className="md:h-[500px] sm:h-[500px] sm:w-[400px] max-h-[500px] md:w-[1000px] max-w-[1200px] rounded-md" />
                            )}
                        </CardContent>
                    </Card>
                    <Button
                        className="w-full mt-4 rounded-xl bg-primary-green hover:bg-[#046e5b]"
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        {t("button.backToHomework")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
