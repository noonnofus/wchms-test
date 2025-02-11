import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/shared/top-nav";
import AdminNav from "@/components/shared/admin-nav";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "West Coast Healthy Memory Society",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full w-full overflow-hidden">
            <body
                className={`${dmSans.variable} antialiased min-w-[360px] w-full h-full flex flex-col`}
            >
                <TopNav />
                <div className="flex-1 p-6 overflow-y-auto">{children}</div>
                <AdminNav />
            </body>
        </html>
    );
}
