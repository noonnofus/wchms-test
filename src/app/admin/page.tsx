"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === "authenticated") {
            if (
                session.user.role === "Admin" ||
                session.user.role === "Staff"
            ) {
                router.push("/admin/landing");
            }
            setLoading(false);
        } else if (status === "loading") {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [status, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            loginType: "admin",
            redirect: false,
        });

        if (res?.error) {
            setError(t("error.invalidEmailOrPassword"));
        } else {
            router.push("/admin/landing");
        }
    };
    if (loading) return null;
    return (
        <div className="flex flex-col gap-12 w-full h-full items-center">
            <h1 className="font-semibold text-4xl">{t("staff login")}</h1>
            <div className="flex flex-col w-full h-full items-center gap-10">
                <p className="font-medium text-xl md:text-2xl text-center">
                    {t("staff login instructions")}
                </p>
                <form className="w-full h-full flex flex-col gap-6 md:gap-4">
                    <div className="w-full">
                        {error && (
                            <p className="text-sm md:text-lg lg:text-xl text-red-500">
                                {error}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="email"
                            className="md:text-lg lg:text-xl"
                        >
                            {t("email address")}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@wchms.com"
                            className="w-full md:text-lg lg:text-xl"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="password"
                            className="md:text-lg lg:text-xl"
                        >
                            {t("password")}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            className="w-full md:text-lg lg:text-xl"
                            placeholder="*********"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        className="mt-2 md:mt-4 w-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-2"
                        onClick={handleLogin}
                    >
                        {t("login")}
                    </Button>
                </form>
            </div>
        </div>
    );
}
