"use client";
import { useParams } from "next/navigation";

export default function Profile() {
    const { participantName } = useParams();
    return (
        <div className="flex flex-col gap-10 w-full items-center h-full">
            <h1 className="font-semibold text-4xl text-center">
                Edit {participantName} Profile
            </h1>
        </div>
    );
}
