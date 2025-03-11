"use client";

import { usePathname } from "next/navigation";
import AdminNav from "@/components/shared/admin-nav";

export default function AdminNavWrapper() {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    if (!isAdmin) return null;

    return (
        pathname.startsWith("/admin/") &&
        pathname !== "/admin/landing" && (
            <div className="flex-1 fixed bottom-0 right-0 left-0 mt-4">
                <AdminNav />
            </div>
        )
    );
}
