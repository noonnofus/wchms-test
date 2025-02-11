"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };
    return (
        <div className="flex flex-col items-center gap-8 h-full">
            <h1 className="mt-4 text-[32px] font-semibold">Logout</h1>
            <Card className="flex flex-col w-full gap-2 items-center text-center py-8 px-4 h-auto">
                <p className="text-xl leading-4 font-semibold">
                    Are you sure you want to
                </p>
                <p className="text-xl font-semibold">LOG OUT?</p>
                <p className="text-xl font-semibold mt-8">
                    You will need to LOG IN again to access your account.
                </p>
            </Card>
            <div className="w-full flex flex-col gap-4">
                <Button
                    type="submit"
                    onClick={handleLogout}
                    className="bg-destructive-red hover:bg-destructive-hover text-destructive-text rounded-full w-full font-semibold text-base min-h-[45px]"
                >
                    Logout
                </Button>

                <Button
                    onClick={() => router.back()}
                    variant="outline"
                    className="border-primary-green hover:bg-primary-green text-primary-green rounded-full w-full font-semibold text-base hover:text-white min-h-[45px]"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
