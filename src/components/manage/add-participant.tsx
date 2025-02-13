"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { addParticipant } from "@/db/queries/participants";

const genders = ["male", "female", "other"];

export default function AddParticipant() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [selectedGender, setSelectedGender] = useState<string | null>();
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
    };

    const handleAddParticipantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (
            !firstName ||
            !lastName ||
            !email ||
            !selectedGender ||
            !dateOfBirth
        ) {
            setError("Missing Field");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/participant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    gender: selectedGender,
                    dateOfBirth: dateOfBirth?.toISOString().split("T")[0],
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add participant");
            }
            console.log("Participant added successfully");
            setFirstName("");
            setLastName("");
            setEmail("");
            setSelectedGender(null);
            setDateOfBirth(null);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-20 min-w-[360px] overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-4xl">Add New Participant</h1>
            <form
                className="flex flex-col gap-4 w-full h-full md:text-2xl"
                method="POST"
                onSubmit={handleAddParticipantSubmit}
            >
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="firstName">First Name</label>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="First Name"
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="lastName">Last Name</label>
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Last Name"
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="email">Email</label>
                        <Input id="email" type="text" placeholder="Email" />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseCategory">Gender</label>
                        <Select onValueChange={handleGenderSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {genders.map((gender, index) => (
                                    <SelectItem
                                        key={index}
                                        value={gender}
                                        className="capitalize"
                                    >
                                        {gender}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <DatePicker />
                </div>
                <div className="w-full flex flex-row gap-2">
                    <Button className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-4">
                        Add
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold text-xl py-4"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
