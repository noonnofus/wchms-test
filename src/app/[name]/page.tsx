"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ParticipantConfirmation() {
    const router = useRouter();
    const { name } = useParams();
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");

    const handleSignIn = async () => {
        if (!lastName) {
            setError("Please enter your last name.");
            return;
        }
        console.log(name, lastName);

        const result = await signIn("credentials", {
            callbackUrl: "/Landing",
            firstName: name,
            lastName: lastName,
            loginType: "participant",
            redirect: false,
        });
        if (result?.error) {
            setError("Invalid Last Name. Please try again.");
        } else {
            router.push("/landing");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSignIn();
        }
    };

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
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="flex flex-row gap-4 w-full justify-between">
                <Button
                    onClick={handleSignIn}
                    className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-4"
                >
                    Enter Site
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
