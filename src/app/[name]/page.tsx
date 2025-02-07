"use client";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ParticipantConfirmation() {
    const { name } = useParams();
    return (
        <div className="flex flex-col gap-20 w-full h-full items-center justify-center">
            <h1 className="font-semibold text-4xl">Welcome back, {name}!</h1>
            <div className="w-full flex flex-col gap-4 items-center">
                <h2 className="font-semibold text-2xl text-center">
                    To continue, please enter your last name:
                </h2>
                <Input
                    type="text"
                    placeholder="Last Name"
                    className="py-6"
                ></Input>
            </div>
            <div className="flex flex-row gap-4 w-full justify-between">
                <Button
                    asChild
                    className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-4"
                >
                    <Link href="/landing">Enter Site</Link>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold text-xl py-4"
                >
                    <Link href="/">Back to Login</Link>
                </Button>
            </div>
        </div>
    );
}
