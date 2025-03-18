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
import { type UserNoPass } from "@/app/admin/manage/staff/page";

const genders = ["Male", "Female", "Other"];
const roles = ["Staff", "Admin"];

export default function EditAdmin({
    closePopup,
    adminData,
    onAdminUpdated,
}: {
    closePopup: () => void;
    adminData: UserNoPass;
    onAdminUpdated: () => void;
}) {
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
        if (
            !password ||
            !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                password
            )
        ) {
            newErrors.password =
                "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.";
            valid = false;
        }
        if (!role) {
            newErrors.role = "Role is required";
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
                    password: password,
                    role: role,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update participant");
            }

            onAdminUpdated();
            console.log("Participant updated successfully");
            closePopup();
        } catch (error) {
            console.error("Error updating participant:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-12 overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                Edit {adminData.firstName}&#39;s Profile
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                onSubmit={handleEditAdminSubmit}
            >
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="email">Email</label>
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                        <Input
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Email"
                            value={email ?? ""}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="password">Password</label>
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password}
                            </p>
                        )}
                        <Input
                            id="password"
                            name="password"
                            type="text"
                            placeholder="*********"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="firstName">First Name</label>
                        {errors.firstName && (
                            <p className="text-red-500 text-sm">
                                {errors.firstName}
                            </p>
                        )}
                        <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="lastName">Last Name</label>
                        {errors.lastName && (
                            <p className="text-red-500 text-sm">
                                {errors.lastName}
                            </p>
                        )}
                        <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label>Gender</label>
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
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {genders.map((gender, index) => (
                                    <SelectItem key={index} value={gender}>
                                        {gender}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseStartDate">Date of Birth</label>
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
                        <label>Role</label>
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
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role, index) => (
                                    <SelectItem key={index} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 gap-2"></div>
                </div>
                <div className="w-full flex flex-row gap-2 mt-4">
                    <Button className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4">
                        {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        onClick={handleCancel}
                        type="button"
                        variant="outline"
                        className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold md:text-xl py-2 md:py-4"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
