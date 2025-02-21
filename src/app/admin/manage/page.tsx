"use client";
import { User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Manage() {
    return (
        <div className="flex flex-col gap-10">
            <h1 className="font-semibold text-4xl text-center">Manage</h1>
            <div className="flex flex-col gap-4">
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-primary-green hover:bg-[#045B47]"
                >
                    <Link href="/admin/manage/participants">
                        <div className="flex flex-col items-center justify-center">
                            <User className="min-w-12 min-h-12" />
                            <p className="text-2xl md:text-3xl">Participant</p>
                        </div>
                    </Link>
                </Button>
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-manage-red hover:bg-[#8E1729]"
                >
                    <Link href="/admin/manage/staffs">
                        <div className="flex flex-col items-center justify-center">
                            <Users
                                className="min-w-12 min-h-12"
                            />
                            <p className="text-2xl md:text-3xl">Staff</p>
                        </div>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
