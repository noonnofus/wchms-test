"use client";
import { useState, useEffect } from "react";
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
import { type Participant } from "@/db/schema/participants";
import { useTranslation } from "react-i18next";

const genders = ["Male", "Female", "Other"];

export default function EditParticipant({
    closePopup,
    participantData,
    onParticipantUpdated,
}: {
    closePopup: () => void;
    participantData: Participant;
    onParticipantUpdated: () => void;
}) {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState(participantData.firstName);
    const [lastName, setLastName] = useState(participantData.lastName);
    const [email, setEmail] = useState(participantData.email);
    const [selectedGender, setSelectedGender] = useState<string | null>(
        participantData.gender
    );
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
        participantData.dateOfBirth
    );
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        gender: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
    });

    useEffect(() => {
        setFirstName(participantData.firstName);
        setLastName(participantData.lastName);
        setEmail(participantData.email);
        setSelectedGender(participantData.gender);
        setDateOfBirth(participantData.dateOfBirth);
    }, [participantData]);

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        closePopup();
    };

    const validateFields = () => {
        const newErrors = {
            email: "",
            gender: "",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            role: "",
            password: "",
        };
        let valid = true;

        if (!firstName.trim()) {
            newErrors.firstName = "First name is required";
            valid = false;
        }
        if (!lastName.trim()) {
            newErrors.lastName = "Last name is required";
            valid = false;
        }
        if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Valid email is required";
            valid = false;
        }
        if (!selectedGender?.trim()) {
            newErrors.gender = "Gender is required";
            valid = false;
        }
        if (!dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleEditParticipantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) return;

        setLoading(true);

        try {
            const response = await fetch(`/api/participants/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    participantId: participantData.id,
                    firstName,
                    lastName,
                    email,
                    gender: selectedGender,
                    dateOfBirth,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update participant");
            }

            onParticipantUpdated();
            console.log("Participant updated successfully");
            closePopup();
        } catch (error) {
            console.error("Error updating participant:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl md:text-4xl text-center mt-4">
                {t("edit participant")}
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                method="POST"
                onSubmit={handleEditParticipantSubmit}
            >
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="firstName">{t("firstName")}</label>
                        {errors.firstName && (
                            <p className="text-red-500 text-sm">
                                {errors.firstName}
                            </p>
                        )}
                        <Input
                            id="firstName"
                            type="text"
                            placeholder={t("firstName")}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="lastName">{t("lastName")}</label>
                        {errors.lastName && (
                            <p className="text-red-500 text-sm">
                                {errors.lastName}
                            </p>
                        )}
                        <Input
                            id="lastName"
                            type="text"
                            placeholder={t("lastName")}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="email">{t("email address")}</label>
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@wchms.com"
                            value={email ?? ""}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseCategory">{t("gender")}</label>
                        {errors.gender && (
                            <p className="text-red-500 text-sm">
                                {errors.gender}
                            </p>
                        )}
                        <Select
                            value={selectedGender ?? ""}
                            onValueChange={handleGenderSelect}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("gender")} />
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
                    <label htmlFor="dateOfBirth">{t("date of birth")}</label>
                    {errors.dateOfBirth && (
                        <p className="text-red-500 text-sm">
                            {errors.dateOfBirth}
                        </p>
                    )}
                    <DatePicker
                        selected={dateOfBirth}
                        onChange={(date) => setDateOfBirth(date ?? null)}
                    />
                </div>
                <div className="w-full flex flex-row gap-2 mt-4">
                    <Button
                        type="submit"
                        className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4"
                    >
                        {loading ? t("updating") : t("update")}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold md:text-xl py-2 md:py-4"
                        onClick={handleCancel}
                    >
                        {t("button.cancel")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
