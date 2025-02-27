"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
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
        <div className="fixed inset-0 h-screen flex items-center justify-center mt-20">
            <div className="w-full max-w-4xl relative -translate-y-28 p-6 mt-16">
                <Card className="py-14">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-black text-2xl font-bold">
                            Staff Login
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="w-full">
                        <CardDescription>
                            Enter your email and password to login to your
                            account
                        </CardDescription>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="wchms@example.com"
                                    className="w-full"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    className="w-full"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div>
                                {error && (
                                    <p className="text-sm text-red-500">
                                        {error}
                                    </p>
                                )}
                            </div>
                            <Button
                                className="w-full rounded-xl bg-primary-green mt-4 hover:bg-[#046e5b]"
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
