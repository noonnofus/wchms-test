"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ChildrenWrapperProps {
    children: ReactNode;
}

export default function ChildrenWrapper({ children }: ChildrenWrapperProps) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    return (
        <div
            className={`flex-grow p-6 overflow-y-auto ${isAdmin ? "mb-16" : ""}`}
        >
            {children}
        </div>
    );
}
