import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import CongratulationPopUp from "./congratulation-popup";
import ClosePopUp from "./close-popup";
import ResultPopup from "./result-popup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface ArithemeticProps {
    question: string | null;
    answer: string | null;
    currentIndex: number;
    correctCount: number;
    totalQuestions: number | 15;
    onNext: () => void;
    setCorrectCount: (count: number) => void;
}

export default function ArithemeticCard({
    question,
    answer,
    onNext,
    currentIndex,
    correctCount,
    totalQuestions,
    setCorrectCount
}: ArithemeticProps) {
    const [userAnswer, setUserAnswer] = useState("");
    const [showCongratPopup, setShowCongratPopup] = useState(false);
    const [showClosePopup, setShowClosePopup] = useState(false);
    const [showResultPopup, setShowResultPopup] = useState(false);

    const router = useRouter();

    const handleSubmit = () => {
        if (userAnswer.trim() === answer) {
            setCorrectCount(correctCount + 1);
            setUserAnswer("");
            setShowCongratPopup(true);
        } else {
            setUserAnswer("");
            setShowClosePopup(true);
        }
    }

    const handleNext = () => {
        setShowCongratPopup(false);
        setShowClosePopup(false);
        if (currentIndex + 1 === totalQuestions) {
            setShowResultPopup(true);
        } else {
            onNext();
        }
    }

    const handleExit = () => {
        setShowCongratPopup(false);
        setShowClosePopup(false);
        router.push("/homework");
    }

    return (
        <div className="flex flex-col gap-8 justify-center items-center">
            {showCongratPopup && (
                <div
                    className="absolute inset-0 flex justify-center items-center min-h-[800px] min-w-[360px] w-full h-full bg-black bg-opacity-50 z-50"
                    onClick={handleNext}
                >
                    <div
                        className="relative max-w-[1000px] w-full bg-white rounded-lg p-6 overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CongratulationPopUp handleNext={handleNext} handleExit={handleExit} />
                    </div>
                </div>
            )}
            {showClosePopup && (
                <div
                    className="absolute inset-0 flex justify-center items-center min-h-[800px] min-w-[360px] w-full h-full bg-black bg-opacity-50 z-50"
                    onClick={handleNext}
                >
                    <div
                        className="relative max-w-[1000px] w-full bg-white rounded-lg p-6 overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ClosePopUp handleNext={handleNext} handleExit={handleExit} />
                    </div>
                </div>
            )}
            {showResultPopup && (
                <div
                    className="absolute inset-0 flex justify-center items-center min-h-[800px] min-w-[360px] w-full h-full bg-black bg-opacity-50 z-50"
                    onClick={handleExit}
                >
                    <div
                        className="relative max-w-[1000px] w-full bg-white rounded-lg p-6 overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ResultPopup correctCount={correctCount} totalQuestions={totalQuestions} handleExit={handleExit} />
                    </div>
                </div>
            )}
            <div className="flex w-full px-6">
                <span className="text-gray-500">{currentIndex + 1}/{totalQuestions}</span>
            </div>
            <h1 className="font-semibold text-4xl text-center">
                15 Arithemetic Questions
            </h1>
            {!question && !answer ? (
                <Card className="p-8 w-96 shadow-lg">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-black text-2xl font-bold text-center">
                            <Skeleton className="h-6 w-3/4 mx-auto" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="w-full flex flex-col items-center">
                        <div className="w-full flex flex-col items-center space-y-4">
                            <Skeleton className="w-full h-12 rounded-md" />
                            <Skeleton className="w-full h-10 rounded-xl" />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="p-8 w-96 shadow-lg">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-black text-2xl font-bold text-center">
                            {question} = <span className="border px-3 py-1 rounded-md text-lg">?</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="w-full flex flex-col items-center">
                        <form
                            className="w-full flex flex-col items-center"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                        >
                            <Input
                                className="w-full p-3 text-center border-2 border-green-500 rounded-md"
                                type="number"
                                placeholder="Enter your answer"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                required
                            />
                            <Button
                                className="w-full mt-4 rounded-xl bg-primary-green hover:bg-[#046e5b]"
                                type="submit"
                            >
                                Confirm
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}