export default function AddScore() {
    const handleAddScoreSubmit = () => {};
    return (
        <div className="flex flex-col gap-12 overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                Add New Boardgame Score
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                method="POST"
                onSubmit={handleAddScoreSubmit}
            ></form>
        </div>
    );
}
