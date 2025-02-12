import { Button } from "@/components/ui/button";

export default function DeleteConfirmation({ body }: { body: string }) {
    return (
        <div className="flex flex-col w-full min-w-[360px] gap-8 py-20 px-8 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl">Before you delete!</h1>
            <form className="flex flex-col items-center justify-center gap-16 w-full h-full md:text-xl">
                <div className="">
                    <p className="text-center text-2xl">{body}</p>
                </div>
                <div className="w-full flex flex-row justify-between gap-6">
                    <Button
                        variant="outline"
                        className="w-full h-[45px] rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold text-base md:text-xl py-4"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-[45px] rounded-full bg-destructive-red text-destructive-text hover:bg-destructive-hover hover:text-destructive-text font-semibold py-4 text-base md:text-xl"
                    >
                        DELETE
                    </Button>
                </div>
            </form>
        </div>
    );
}
