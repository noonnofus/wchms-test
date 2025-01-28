"use client";
import TabsMenu from "@/components/shared/tabs-menu";

export default function Courses() {
    return (
        <TabsMenu
            leftLabel="My Courses"
            rightLabel="All Courses"
            leftChildren={<div></div>}
            rightChildren={<div></div>}
        />
    );
}
