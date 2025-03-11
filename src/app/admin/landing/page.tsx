"use client";
import BookIcon from "@/components/icons/book-icon";
import GearIcon from "@/components/icons/gear-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function AdminLanding() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-10 w-full h-full items-center">
            <h1 className="font-semibold text-4xl text-center">
                {t("instructor overview")}
            </h1>
            <div className="w-full flex flex-col gap-4">
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-primary-green hover:bg-[#045B47]"
                >
                    <Link href="/admin/courses">
                        <div className="flex flex-col items-center justify-center">
                            <BookIcon className="min-w-12 min-h-12" />
                            <p className="text-2xl md:text-3xl">
                                {t("course", { count: 2 })}
                            </p>
                        </div>
                    </Link>
                </Button>
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-homework-yellow hover:bg-[#E0A800]"
                >
                    <Link href="/admin/manage/participants">
                        <div className="flex flex-col items-center justify-center">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="min-w-12 min-h-12"
                            >
                                <path
                                    d="M32 14C32 18.4183 28.4183 22 24 22C19.5817 22 16 18.4183 16 14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14Z"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M24 28C16.268 28 10 34.268 10 42H38C38 34.268 31.732 28 24 28Z"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <p className="text-2xl md:text-3xl">
                                {t("participant", { count: 2 })}
                            </p>
                        </div>
                    </Link>
                </Button>
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-manage-red hover:bg-[#8B182A]"
                >
                    <Link href="/admin/manage">
                        <div className="flex flex-col items-center justify-center">
                            <GearIcon className="min-w-12 min-h-12" />
                            <p className="text-2xl md:text-3xl">
                                {t("manage", { count: 2 })}
                            </p>
                        </div>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
