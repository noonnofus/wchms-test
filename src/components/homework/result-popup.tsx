import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function ResultPopup({
    correctCount,
    totalQuestions,
    handleExit,
}: {
    correctCount: number;
    totalQuestions: number;
    handleExit: () => void;
}) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col justify-center items-center mt-4">
                <Image
                    src="/activity-congratulation.svg"
                    width={200}
                    height={200}
                    alt="image of congratulating correct answer"
                />
                <div className="flex flex-col justify-center items-center">
                    <h1 className="font-medium text-3xl text-center text-primary-green">
                        {t("quizCompleted")}
                    </h1>
                    <p className="text-primary-green">
                        {t("quizResult", { totalQuestions, correctCount })}
                    </p>
                </div>
            </div>

            <div className="w-full flex flex-row justify-between gap-6 mb-2">
                <Button
                    variant="outline"
                    className="w-full h-[45px] rounded-full bg-primary-green text-white hover:bg-[#045B47] hover:text-white font-semibold text-base md:text-xl py-4"
                    onClick={handleExit}
                >
                    {t("button.backToHomework")}
                </Button>
            </div>
        </div>
    );
}
