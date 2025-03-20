"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
            setError("Invalid email or password");
        } else {
            router.push("/admin/landing");
        }
    };
    if (loading) return null;
    return (
        <div className="flex flex-col gap-12 w-full h-full items-center">
            <h1 className="font-semibold text-4xl">Staff Login</h1>
            <div className="flex flex-col w-full h-full items-center gap-10">
                <p className="font-medium text-xl md:text-2xl text-center">
                    Enter your email and password to login to your account
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
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="wchms@example.com"
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
                            Password
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
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}
