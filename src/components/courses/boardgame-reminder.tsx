import { Button } from "@/components/ui/button";

export default function BoardGameReminder({
    handleSubmit,
}: {
    handleSubmit: () => void;
}) {

    return (
        <div className="flex flex-col w-full gap-8 py-20 px-8 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl">Return to Zoom</h1>
            <form
                className="flex flex-col items-center justify-center gap-16 w-full h-full md:text-xl"
                onSubmit={handleSubmit}
            >
                <div className="">
                    <p className="text-center text-2xl">
                        Return to Zoom to finish the board game exercise.
                    </p>
                </div>
                <div className="w-full flex flex-row justify-between gap-6">
                    <Button
                        variant="outline"
                        className="w-full h-[45px] rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold text-base md:text-xl py-4"
                    >
                        Return to Zoom
                    </Button>
                </div>
            </form>
        </div>
    );
}
