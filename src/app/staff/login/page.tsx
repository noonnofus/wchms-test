import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LogIn() {
    return (
        <div className="fixed inset-0 h-screen flex items-center justify-center mt-20">
            <div className="w-full max-w-4xl relative -translate-y-28 p-6 mt-16">
                <Card className="py-14">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-black text-2xl font-bold">Staff Login</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full">
                        <CardDescription>Enter your email and password to login to your account</CardDescription>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="wchms@example.com" className="w-full" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" className="w-full" required />
                            </div>
                            <Button type="submit" className="w-full rounded-xl bg-primary-green mt-4">
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
