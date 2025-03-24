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
import { type User } from "@/db/schema/users";
import { useTranslation } from "react-i18next";

const genders = ["Male", "Female", "Other"];
const roles = ["Staff", "Admin"];

export default function EditAdmin({
    closePopup,
    adminData,
    onAdminUpdated,
}: {
    closePopup: () => void;
    adminData: User;
    onAdminUpdated: () => void;
}) {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState(adminData.firstName);
    const [lastName, setLastName] = useState(adminData.lastName);
    const [email, setEmail] = useState(adminData.email);
    const [role, setRole] = useState<string | null>(adminData.role);
    const [password, setPassword] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string | null>(
        adminData.gender
    );
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
        adminData.dateOfBirth
    );
    const [errors, setErrors] = useState({
        email: "",
        gender: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        role: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFirstName(adminData.firstName);
        setLastName(adminData.lastName);
        setEmail(adminData.email);
        setSelectedGender(adminData.gender);
        setDateOfBirth(adminData.dateOfBirth);
    }, [adminData]);

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
    };

    const handleRoleSelect = (role: string) => {
        setRole(role);
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
            newErrors.firstName = t("error.missingFirstName");
            valid = false;
        }
        if (!lastName.trim()) {
            newErrors.lastName = t("error.missingLastName");
            valid = false;
        }
        if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = t("error.invalidEmail");
            valid = false;
        }
        if (!selectedGender?.trim()) {
            newErrors.gender = t("error.missingGender");
            valid = false;
        }
        if (!dateOfBirth) {
            newErrors.dateOfBirth = t("error.missingDateOfBirth");
            valid = false;
        }
        if (
            password &&
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

    const handleEditAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) return;

        setLoading(true);

        try {
            const response = await fetch(`/api/admin/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: adminData.id,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    gender: selectedGender,
                    dateOfBirth: dateOfBirth,
                    password: password !== null ? password : adminData.password,
                    role: role,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update participant");
            }

            onAdminUpdated();
            console.log("Admin updated successfully");
            closePopup();
        } catch (error) {
            console.error("Error updating admin:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-12 overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                {t("edit staff", {
                    firstName: adminData.firstName,
                    lastName: adminData.lastName,
                })}
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                onSubmit={handleEditAdminSubmit}
            >
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="email">{t("email address")}</label>
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                        <Input
                            id="email"
                            name="email"
                            type="text"
                            placeholder={t("email address")}
                            value={email ?? ""}
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
                            name="password"
                            type="password"
                            placeholder="*********"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="firstName">{t("firstName")}</label>
                        {errors.firstName && (
                            <p className="text-red-500 text-sm">
                                {errors.firstName}
                            </p>
                        )}
                        <Input
                            id="firstName"
                            name="firstName"
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
                            name="lastName"
                            type="text"
                            placeholder={t("lastName")}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label>{t("gender")}</label>
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
                                <SelectValue
                                    placeholder={t("placeholder.selectGender")}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {genders.map((gender, index) => (
                                    <SelectItem key={index} value={gender}>
                                        {t(`${gender.toLowerCase()}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseStartDate">
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
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label>{t("role")}</label>
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
                                <SelectValue
                                    placeholder={t("placeholder.selectRole")}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role, index) => (
                                    <SelectItem key={index} value={role}>
                                        {t(`${role.toLowerCase()}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 gap-2"></div>
                </div>
                <div className="w-full flex flex-row gap-2 mt-4">
                    <Button className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4">
                        {loading ? t("updating") : t("update")}
                    </Button>
                    <Button
                        onClick={handleCancel}
                        type="button"
                        variant="outline"
                        className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold md:text-xl py-2 md:py-4"
                    >
                        {t("button.cancel")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
