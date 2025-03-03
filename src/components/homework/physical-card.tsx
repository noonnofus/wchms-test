import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

interface PhysicalProps {
    videoUrl: string;
}

export default function PhysicalCard({
    videoUrl
}: PhysicalProps) {
    const [videoTitle, setVideoTitle] = useState("");
    const [videoId, setVideoId] = useState("");

    const router = useRouter();

    useEffect(() => {
        const id = videoUrl.split("v=")[1]?.split("&")[0];
        if (id) {
            setVideoId(id);
            fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`)
                .then((res) => res.json())
                .then((data) => setVideoTitle(data.title))
                .catch((err) => console.error("Error fetching video title:", err));
        }
    }, [videoUrl]);

    const handleSubmit = () => {
        router.push("/homework");
    }

    return (
        <div className="flex justify-center items-center w-full md:px-4">
            <div className="flex flex-col justify-center items-center w-full max-w-6xl gap-4">
                <h1 className="font-semibold text-4xl text-center">
                    Physical Exercise
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
                            ) : (
                                <p>Please wait until the video is ready</p>
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
                        Back to Homework
                    </Button>
                </div>
            </div>
        </div>
    );
}