"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BookIcon from "../icons/book-icon";
import GearIcon from "../icons/gear-icon";
import HomeIcon from "../icons/home-icon";
import { useTranslation } from "react-i18next";

export default function AdminNav() {
    const path = usePathname();
    const { t } = useTranslation();
    return (
        path.startsWith("/admin/") &&
        path !== "/admin/landing" && (
            <div className="p-6 max-h-20 md:max-h-24 flex justify-center items-center bg-white">
                <div className="flex justify-center items-center w-full gap-12 md:gap-32 text-[#545F71] text-base font-semibold">
                    <Link href="/admin/landing">
                        <div className="flex flex-col items-center justify-center">
                            <HomeIcon className="stroke-2 max-h-6 max-w-6" />
                            {t("home")}
                        </div>
                    </Link>
                    <Link href="/admin/courses">
                        <div className="flex flex-col items-center justify-center">
                            <BookIcon className="stroke-2 max-h-6 max-w-6" />
                            {t("course", { count: 2 })}
                        </div>
                    </Link>
                    <Link href="/admin/manage">
                        <div className="flex flex-col items-center justify-center">
                            <GearIcon className="stroke-2 max-h-6 max-w-6" />
                            {t("manage")}
                        </div>
                    </Link>
                </div>
            </div>
        )
    );
}
