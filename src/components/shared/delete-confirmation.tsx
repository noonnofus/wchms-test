import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function DeleteConfirmation({
    title,
    body,
    actionLabel,
    handleSubmit,
    closePopup,
}: {
    title: string;
    body: string;
    actionLabel: string;
    handleSubmit: (e: React.FormEvent) => void;
    closePopup: () => void;
}) {
    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        closePopup();
    };
    const { t } = useTranslation();
    return (
        <div className="flex flex-col w-full gap-8 py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-2xl md:text-3xl text-center">
                {title}
            </h1>
            <form
                className="flex flex-col items-center justify-center gap-8 md:gap-12 w-full h-full md:text-xl"
                onSubmit={(event) => handleSubmit(event)}
            >
                <div className="">
                    <p className="text-center text-xl md:text-2xl">{body}</p>
                </div>
                <div className="w-full flex flex-row justify-between gap-2">
                    <Button
                        variant="outline"
                        className="w-full h-full rounded-full bg-destructive-red text-destructive-text hover:bg-destructive-hover hover:text-destructive-text font-semibold py-2 md:py-4 text-base md:text-xl"
                    >
                        {actionLabel}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold text-base md:text-xl py-2 md:py-4"
                        onClick={handleCancel}
                    >
                        {t("button.cancel")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
