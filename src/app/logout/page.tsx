"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

function LogoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useTranslation();

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login", redirect: false });
        const redirect = searchParams.get("redirect") || "/";

        window.location.replace(redirect);
    };
    return (
        <div className="flex flex-col items-center gap-8 h-full">
            <h1 className="mt-4 text-[32px] font-semibold">{t("logout")}</h1>
            <Card className="flex flex-col w-full gap-2 items-center text-center py-8 px-4 h-auto">
                <p className="text-xl leading-4 font-semibold">
                    {t("logout.confirmation")}
                </p>
                <p className="text-xl font-semibold mt-8">
                    {t("logout.warning")}
                </p>
            </Card>
            <div className="w-full flex flex-col gap-4">
                <Button
                    type="submit"
                    onClick={handleLogout}
                    className="bg-destructive-red hover:bg-destructive-hover text-destructive-text rounded-full w-full font-semibold text-base min-h-[45px]"
                >
                    {t("logout")}
                </Button>

                <Button
                    onClick={() => router.back()}
                    variant="outline"
                    className="border-primary-green hover:bg-primary-green text-primary-green rounded-full w-full font-semibold text-base hover:text-white min-h-[45px]"
                >
                    {t("button.cancel")}
                </Button>
            </div>
        </div>
    );
}

export default function Logout() {
    const { t } = useTranslation();
    return (
        <Suspense fallback={<div>{t("loading")}</div>}>
            <LogoutContent />
        </Suspense>
    );
}
