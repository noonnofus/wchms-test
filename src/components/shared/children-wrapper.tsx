"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ChildrenWrapperProps {
    children: ReactNode;
}

export default function ChildrenWrapper({ children }: ChildrenWrapperProps) {
    const pathname = usePathname();
    const isAdmin = pathname.includes("/admin/");

    return (
        <div
            className={`flex-grow p-6 overflow-y-auto ${isAdmin ? "mb-16 md:mb-36" : ""}`}
        >
            {children}
        </div>
    );
}
