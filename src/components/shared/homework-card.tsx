import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface HomeworkCardProps {
    title: string;
    activity: string;
    difficulty: string;
}

export default function HomeworkCard({
    title,
    activity,
    difficulty,
}: HomeworkCardProps) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col max-w-[1000px] w-full items-center">
            <Card className="relative gap-6 md:gap-8 z-0 ">
                <CardHeader className="py-0 pt-6">
                    <CardTitle className="text-center px-6 sm:px-4 md:px-4">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-left w-full flex flex-col gap-4">
                    <Button
                        asChild
                        className="bg-primary-green hover:bg-[#045B47] rounded-full text-white w-full font-semibold text-base min-h-[45px]"
                    >
                        <a
                            href={`/homework/${activity}?difficulty=${difficulty}`}
                        >
                            {t("button.startActivity")}
                        </a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
