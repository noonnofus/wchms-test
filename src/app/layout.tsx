import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/shared/top-nav";
import AdminNav from "@/components/shared/admin-nav";
import SessionProviderWrapper from "@/components/shared/session-provider-wrapper";
import ChildrenWrapper from "@/components/shared/children-wrapper";

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
        <SessionProviderWrapper>
            <html lang="en" className="h-full w-full overflow-hidden">
                <body
                    className={`${dmSans.variable} antialiased min-w-[360px] w-full h-full flex flex-col`}
                >
                    <TopNav />
                    <ChildrenWrapper>{children}</ChildrenWrapper>
                    <div className="flex-1 fixed bottom-0 right-0 left-0">
                        <AdminNav />
                    </div>
                </body>
            </html>
        </SessionProviderWrapper>
    );
}
