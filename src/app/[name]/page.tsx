"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ParticipantConfirmation() {
    const { t } = useTranslation();
    const router = useRouter();
    const { name } = useParams();
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === "authenticated") {
            if (
                session.user.role === "Admin" ||
                session.user.role === "Staff"
            ) {
                return router.push("/admin/landing");
            }
            router.push("/landing");
        } else if (status === "loading") {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [status, router]);

    const handleSignIn = async () => {
        if (!lastName) {
            setError("Please enter your last name.");
            return;
        }

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
    if (loading) return null;
    return (
        <div className="flex flex-col gap-20 w-full h-full items-center justify-center">
            <h1 className="font-semibold text-4xl capitalize">
                {t("welcome back", { firstName: name })}
            </h1>
            <div className="w-full flex flex-col gap-4 items-center">
                <h2 className="font-semibold text-2xl text-center">
                    {t("login instructions")}
                </h2>
                <Input
                    type="text"
                    placeholder={t("lastName")}
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
                    {t("button.enterSite")}
                </Button>
                <Button
                    asChild
                    variant="outline"
                    className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold text-xl py-4"
                >
                    <Link href="/">{t("button.backToLogin")}</Link>
                </Button>
            </div>
        </div>
    );
}
