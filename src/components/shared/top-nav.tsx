"use client";
import Image from "next/image";
import { LanguageDropdown } from "../language-dropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function TopNav() {
    const path = usePathname();
    const router = useRouter();
    return (
        <div className="p-6 min-w-[360px] min-h-28 flex items-center">
            <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                    {/* If its not the root page render a button */}
                    {path !== "/" ? (
                        // if its not the landing page render a back button, else render a logout button
                        path !== "/landing" && path !== "/admin" ? (
                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                className="inline-flex items-center justify-center gap-0 whitespace-nowrap rounded-md text-sm pl-3 pr-4 py-2 h-9 border-primary-green text-primary-green hover:bg-primary-green hover:text-white hover:stroke-white"
                            >
                                <svg
                                    width="23"
                                    height="24"
                                    viewBox="0 0 23 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-current"
                                >
                                    <g id="chevron-left">
                                        <path
                                            id="Icon"
                                            d="M14.3023 19L7.62792 12L14.3023 5"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                </svg>
                                Back
                            </Button>
                        ) : (
                            <Button
                                asChild
                                variant="outline"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm px-4 py-2 h-9 border-destructive-hover text-destructive-text hover:bg-destructive-hover hover:text-destructive-text"
                            >
                                <Link
                                    href={`/logout?redirect=${path === "/admin" ? path : "/"}`}
                                >
                                    Logout
                                </Link>
                            </Button>
                        )
                    ) : null}
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="West Coast Healthy Memory Society Logo"
                            width={48}
                            height={48}
                        />
                    </Link>
                </div>
                <div className="flex-1 flex items-center justify-end">
                    <LanguageDropdown />
                </div>
            </div>
        </div>
    );
}
