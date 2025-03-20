import NotificationSystem from "@/components/notification-system";
import AdminNav from "@/components/shared/admin-nav";
import ChildrenWrapper from "@/components/shared/children-wrapper";
import SessionProviderWrapper from "@/components/shared/session-provider-wrapper";
import TopNav from "@/components/shared/top-nav";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import I18NextProviderWrapper from "@/components/shared/i18next-provider-wrapper";

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
                <I18NextProviderWrapper>
                    <body
                        className={`${dmSans.variable} antialiased min-w-[360px] w-full h-full flex flex-col`}
                    >
                        <TopNav />
                        <NotificationSystem />
                        <ChildrenWrapper>{children}</ChildrenWrapper>
                        <div className="flex-1 fixed bottom-0 right-0 left-0">
                            <AdminNav />
                        </div>
                    </body>
                </I18NextProviderWrapper>
            </html>
        </SessionProviderWrapper>
    );
}
