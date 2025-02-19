"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type User } from "@/db/schema/users";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

const genders = [
    'Male',
    'Female',
    'Other'
]

const roles = [
    'Staff',
    'Admin',
]

// Cannot SEE the password, but only CHANGE the password.
// TODO: password need validation ✅

export default function StaffEdit() {
    const [admin, setAdmin] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        gender: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        role: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        gender: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        role: "",
        password: "",
    });

    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        if (!id) return;

        fetch(`/api/admin/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    setFormData({
                        email: data.email,
                        gender: data.gender,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        dateOfBirth: data.dateOfBirth,
                        role: data.role,
                        password: ""
                    })
                    setAdmin(data);
                    setIsLoading(false);
                }
            })
    }, [id])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleDateChange = (name: string, date: Date | undefined) => {
        if (date === undefined) {
            return;
        }
        setFormData({
            ...formData,
            [name]: String(date),
        })
    }

    const validateFields = () => {
        let newErrors = {
            email: "",
            gender: "",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            role: "",
            password: "",
        };
        let valid = true;

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
            valid = false;
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
            valid = false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Valid email is required";
            valid = false;
        }
        if (!formData.gender.trim()) {
            newErrors.gender = "Gender is required";
            valid = false;
        }
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required";
            valid = false;
        }
        if (!formData.password.trim() || /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
            newErrors.password = "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.";
            valid = false;
        }
        if (!formData.role) {
            newErrors.role = "Role is required";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFields()) return;

        try {
            const res = await fetch("/api/admin/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: id,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth,
                    password: formData.password,
                    role: formData.role,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");

        } catch (error) {
            console.error("Failed to delete participant", error);
        } finally {
            router.push("/admin/manage/staffs");
        }
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/admin/manage/staffs");
    }

    return (
        <Card className="w-full h-full flex">
            {isLoading ? (
                <div className="flex flex-col gap-20 w-full h-full overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
                    <Skeleton className="w-1/2 h-10 rounded-md" />
                    <div className="flex flex-col gap-10 w-full h-full flex-1 md:text-2xl">
                        <div className="w-full flex flex-row gap-2">
                            <Skeleton className="w-1/2 h-10 rounded-md" />
                            <Skeleton className="w-1/2 h-10 rounded-md" />
                        </div>
                        <div className="w-full flex flex-row gap-2">
                            <Skeleton className="w-1/2 h-10 rounded-md" />
                            <Skeleton className="w-1/2 h-10 rounded-md" />
                        </div>
                        <div className="w-full flex flex-row gap-2">
                            <Skeleton className="w-1/2 h-10 rounded-md" />
                            <Skeleton className="w-1/2 h-10 rounded-md" />
                        </div>
                        <div className="w-full flex flex-row gap-2">
                            <Skeleton className="w-1/2 h-10 rounded-md" />
                        </div>
                        <div className="w-full flex flex-row gap-2">
                            <Skeleton className="w-full h-12 rounded-full" />
                            <Skeleton className="w-full h-12 rounded-full border" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-20 w-full h-full overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
                    <h1 className="font-semibold text-4xl">Edit {admin?.firstName}&#39;s Profile</h1>
                    <form
                        className="flex flex-col gap-10 w-full h-full flex-1 md:text-2xl"
                        onSubmit={handleUpdate}
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
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    value={formData.password}
                                    onChange={handleChange}
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
                                    value={formData.firstName}
                                    onChange={handleChange}
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
                                    value={formData.lastName}
                                    onChange={handleChange}
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
                                    value={formData.gender}
                                    onValueChange={(value) =>
                                        handleSelectChange('gender', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder="Select Gender"
                                        />
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
                                <label htmlFor="courseStartDate">
                                    Date of Birth
                                </label>
                                {errors.dateOfBirth && (
                                    <p className="text-red-500 text-sm">
                                        {errors.dateOfBirth}
                                    </p>
                                )}
                                <DatePicker
                                    selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                                    onChange={(date) => handleDateChange("dateOfBirth", date)}
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
                                    value={formData.role}
                                    onValueChange={(value) =>
                                        handleSelectChange('role', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder="Select Gender"
                                        />
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
                            <div className="flex flex-col flex-1 gap-2">
                            </div>
                        </div>
                        <div className="w-full flex flex-row gap-2">
                            <Button
                                className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-4"
                            >
                                Save
                            </Button>
                            <Button
                                onClick={handleCancel}
                                type="button"
                                variant="outline"
                                className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold text-xl py-4"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div >
            )}

        </Card >
    );
}