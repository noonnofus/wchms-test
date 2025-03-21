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
import { useTranslation } from "react-i18next";

const genders = ["Male", "Female", "Other"];
const roles = ["Admin", "Staff"];

export default function AddAdmin({
    onAdminAdded,
    closePopup,
}: {
    onAdminAdded: () => void;
    closePopup: () => void;
}) {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        dateOfBirth: "",
        password: "",
        role: "",
    });

    const validateFields = () => {
        const newErrors = {
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            dateOfBirth: "",
            password: "",
            role: "",
        };
        let valid = true;

        if (!firstName.trim()) {
            newErrors.firstName = t("error.missingFirstName");
            valid = false;
        }
        if (!lastName.trim()) {
            newErrors.lastName = t("error.missingLastName");
            valid = false;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = t("error.invalidEmail");
            valid = false;
        }
        if (!selectedGender) {
            newErrors.gender = t("error.missingGender");
            valid = false;
        }
        if (!dateOfBirth) {
            newErrors.dateOfBirth = t("error.missingDateOfBirth");
            valid = false;
        }
        if (
            !password.trim() ||
            !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                password
            )
        ) {
            newErrors.password = t("error.invalidPasswordFormat");
            valid = false;
        }
        if (!role) {
            newErrors.role = t("error.missingRole");
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
    };

    const handleRoleSelect = (role: string) => {
        setRole(role);
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        setFirstName("");
        setLastName("");
        setEmail("");
        setSelectedGender(null);
        setDateOfBirth(null);
        setPassword("");
        setRole(null);
        setErrors({
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            dateOfBirth: "",
            password: "",
            role: "",
        });
        closePopup();
    };

    const handleAddParticipantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!validateFields()) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/admin/create", {
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
                    password,
                    role,
                }),
            });

            if (!response.ok) {
                response.status === 409 && setServerError("Admin/Staff with this email already exists, please try again with other email.");
                throw new Error("Failed to add admin");
            }

            onAdminAdded();

            setFirstName("");
            setLastName("");
            setEmail("");
            setSelectedGender(null);
            setDateOfBirth(null);
            setPassword("");
            setRole(null);
            closePopup();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-12 overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                {t("add new staff")}
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                method="POST"
                onSubmit={handleAddParticipantSubmit}
            >
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="password">{t("password")}</label>
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password}
                            </p>
                        )}
                        <Input
                            id="password"
                            type="password"
                            placeholder={t("password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
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
                                        {t(`${gender.toLowerCase()}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="dateOfBirth">
                            {t("date of birth")}
                        </label>
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
                </div>
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="roleCategory">{t("role")}</label>
                        {errors.role && (
                            <p className="text-red-500 text-sm">
                                {errors.role}
                            </p>
                        )}
                        <Select
                            value={role ?? ""}
                            onValueChange={handleRoleSelect}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("role")} />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role, index) => (
                                    <SelectItem
                                        key={index}
                                        value={role}
                                        className="capitalize"
                                    >
                                        {t(`${role.toLowerCase()}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 gap-2"></div>
                </div>
                {serverError && (
                    <p className="text-red-500 text-center text-sm">
                        {serverError}
                    </p>
                )}
                <div className="w-full flex flex-row gap-2 mt-4">
                    <Button
                        type="submit"
                        className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4"
                    >
                        {loading ? t("adding") : t("add")}
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
