import { CourseParticipant } from "@/db/schema/course";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AddParticipant() {
    const { courseId } = useParams();
    const [errors, setErrors] = useState({
        courseParticipants: "",
    });

    useEffect(() => {
        const unenrolledParticipants = async () => {
            try {
                const res = await fetch();
            } catch (error) {}
        };
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="flex flex-col gap-12 w-full h-full py-8 px-6 rounded-lg bg-white items-center justify-center overf">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                Add Participant
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        {courseId && (
                            <div className="flex flex-col flex-1 gap-2">
                                <label htmlFor="courseParticipants">
                                    Participants
                                </label>
                                {errors.courseParticipants && (
                                    <p className="text-red-500 text-sm">
                                        {errors.courseParticipants}
                                    </p>
                                )}
                                {/* Checkboxes with list of participants that aren't enrolled */}
                            </div>
                        )}
                    </div>
                </div>
                <Button className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4">
                    Add
                </Button>
            </form>
        </div>
    );
}
