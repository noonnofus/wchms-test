import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function CongratulationPopUp({
    handleNext,
    handleExit,
}: {
    handleNext: () => void;
    handleExit: () => void;
}) {
    const { t } = useTranslation();
    return (
        <form
            className="flex flex-col gap-8"
            onSubmit={(e) => {
                e.preventDefault(); // 기본 제출 방지
                handleNext(); // Next Question 실행
            }}
        >
            <div className="flex flex-col justify-center items-center mt-4">
                <Image
                    src="/activity-congratulation.svg"
                    width={200}
                    height={200}
                    alt="image of congratulating correct answer"
                />
                <div className="flex flex-col justify-center items-center">
                    <h1 className="font-medium text-3xl text-center text-primary-green">
                        {t("congratulations")}
                    </h1>
                    <p className="text-primary-green">
                        {t("congratulations.body")}
                    </p>
                </div>
            </div>

            <div className="w-full flex flex-row justify-between gap-6 mb-2">
                <Button
                    variant="outline"
                    className="w-full h-[45px] rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold text-base md:text-xl py-4"
                    onClick={handleExit}
                    type="button" // Enter 눌러도 실행되지 않도록 설정
                >
                    {t("button.exitExercise")}
                </Button>
                <Button
                    variant="outline"
                    className="w-full h-[45px] rounded-full bg-primary-green text-white hover:bg-[#045B47] hover:text-white font-semibold text-base md:text-xl py-4"
                    type="submit"
                >
                    {t("button.nextQuestion")}
                </Button>
            </div>
        </form>
    );
}
