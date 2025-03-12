import AddRoom from "@/components/courses/add-room";

export default function Page() {

    return (
        <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
            <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                <AddRoom />
            </div>
        </div>
    );
}