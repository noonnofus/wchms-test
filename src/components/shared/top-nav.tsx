"use client";
import Image from "next/image";
import { LanguageDropdown } from "../language-dropdown";
import Link from "next/link";

export default function TopNav() {
    return (
        <div className="p-6 min-w-[360px] min-h-28 flex items-center">
            <div className="flex justify-between items-center w-full">
                <div className="flex-1">{/*render a back button here */}</div>
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
