"use client";
import BookIcon from "@/components/icons/book-icon";
import GearIcon from "@/components/icons/gear-icon";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLanding() {
    return (
        <div className="flex flex-col gap-10 w-full h-full items-center">
            <h1 className="font-semibold text-4xl text-center">
                Staff Overview
            </h1>
            <div className="w-full flex flex-col gap-4">
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-primary-green hover:bg-[#045B47]"
                >
                    <Link href="/admin/courses">
                        <div className="flex flex-col items-center justify-center">
                            <BookIcon className="min-w-12 min-h-12" />
                            <p className="text-2xl md:text-3xl">Courses</p>
                        </div>
                    </Link>
                </Button>
                <Button
                    asChild
                    className="min-h-[16vh] rounded-lg bg-homework-yellow hover:bg-[#E0A800]"
                >
                    <Link href="/admin/rooms">
                        <div className="flex flex-col items-center justify-center">
                            <Building className="min-w-12 min-h-12" />
                            <p className="text-2xl md:text-3xl">Rooms</p>
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
                            <p className="text-2xl md:text-3xl">Manage</p>
                        </div>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
