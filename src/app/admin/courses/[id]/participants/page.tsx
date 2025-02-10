"use client";
import ChevronDownIcon from "@/components/icons/chevron-down-icon";
import ChevronUpIcon from "@/components/icons/chevron-up-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function ClassParticipants() {
    const courseWithParticipants = {
        id: "4",
        name: "第20期：脳の運動教室(シン 脳の運動教室)",
        image: "/course-image.png",
        imgAlt: "A Snake",
        description:
            "2025年は、60年に一度巡ってくる「乙巳（きのと・み）」の年。乙巳の年は、新しいものが生まれ、成長していく年と言われています。第19期となる脳の運動教室も、今年は「シン 脳の運動教室」としてブラッシュアップしていきます！皆さま、本年もよろしくお願いいたします。",
        materials: [
            {
                title: "Week 4: Just a file",
                content: null,
                createdAt: new Date(1738859550),
                file: "Week4.pdf",
            },
            {
                title: "Week 3",
                content: "No review materials this week",
                createdAt: new Date(1738859550),
                file: null,
            },
            {
                title: "Week 2",
                content:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id enim eget sem maximus accumsan. Pellentesque id varius mi, non sollicitudin orci. Donec eu condimentum justo. Donec vel sapien arcu. Quisque dapibus ligula non imperdiet malesuada.",
                createdAt: new Date(1738859545),
                file: "Week2.pdf",
            },
            {
                title: "Week 1: A really long title to see how it would look with multiple lines",
                content: "Some description",
                createdAt: new Date(1738859540),
                file: "Week1.pdf",
            },
        ],
        participants: [
            {
                id: "1",
                firstName: "Annabelle",
                lastName: "Chen",
                city: "Vancouver",
            },
            {
                id: "2",
                firstName: "Kevin",
                lastName: "So",
                city: "Vancouver",
            },
            {
                id: "3",
                firstName: "Armaan",
                lastName: "Brar",
                city: "Surrey",
            },
            {
                id: "4",
                firstName: "Angus",
                lastName: "Ng",
                city: "Vancouver",
            },
        ],
    };
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSortChange = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    const filteredParticipants = courseWithParticipants.participants
        .filter((participant) => {
            const fullName =
                `${participant.firstName} ${participant.lastName}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();

            if (sortOrder === "asc") {
                return nameA.localeCompare(nameB); // A-Z
            } else {
                return nameB.localeCompare(nameA); // Z-A
            }
        });
    return (
        <div className="flex flex-col gap-10 w-full items-center">
            <h1 className="font-semibold text-4xl text-center">
                Participant List
            </h1>
            <Card className="flex flex-col h-full">
                <CardHeader className="w-full">
                    <h2 className="text-xl md:text-3xl font-semibold">
                        {courseWithParticipants.name}
                    </h2>
                    <div className="flex gap-2 md:gap-4 items-center">
                        <Input
                            type="text"
                            placeholder="Search"
                            className="mt-2 md:mt-4 py-4 md:py-6 w-full"
                            onChange={handleSearchChange}
                        ></Input>
                        <button className="mt-2 md:mt-4 flex flex-col min-w-8 min-h-8 md:min-h-12 md:min-w-12 border-2 md:border-[3px] border-primary-green text-primary-green rounded-full justify-center items-center">
                            <PlusIcon className="w-3/5 h-3/5" />
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="w-full flex-grow overflow-auto">
                    <Table className="w-full flex flex-col">
                        <TableHeader>
                            <TableRow className="flex text-base md:text-xl font-semibold">
                                <TableHead className="flex-1 flex gap-2 items-center text-left text-black">
                                    Participant
                                    <button
                                        onClick={handleSortChange}
                                        className="flex items-center"
                                    >
                                        {sortOrder === "asc" ? (
                                            <ChevronDownIcon className="text-primary-green" />
                                        ) : (
                                            <ChevronUpIcon className="text-primary-green" />
                                        )}
                                    </button>
                                </TableHead>
                                <TableHead className="flex-shrink-0 text-center p-0 w-20 med:w-24 text-black">
                                    Remove
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredParticipants.map((participant) => {
                                return (
                                    <TableRow
                                        key={participant.id}
                                        className="flex"
                                    >
                                        <TableCell className="flex-1 text-left text-base md:text-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="hidden md:flex md:flex-col md:w-10 md:h-10 rounded-full bg-gray-200 items-center justify-center">
                                                    {`${participant.firstName[0]}${participant.lastName[0]}`}
                                                </div>
                                                {`${participant.firstName} ${participant.lastName}`}
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex justify-center items-center px-0 w-20 med:w-24">
                                            <Link href="#">
                                                <DeleteIcon className="inline-flex flex-col text-center justify-center items-center" />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
