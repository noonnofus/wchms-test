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
import { Textarea } from "../ui/textarea";
import { useTranslation } from "react-i18next";

const mediums = ["Online", "In-Person"];
const statuses = ["Available", "Unavailable"];

export default function AddRoom({
    onRoomAdded,
    closePopup,
}: {
    onRoomAdded: () => void;
    closePopup: () => void;
}) {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [selectedMedium, setSelectedMedium] = useState("Online");
    const [url, setUrl] = useState("");
    const [capacity, setCapacity] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Available");
    const [description, setDescription] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        medium: "",
        url: "",
        status: "",
        capacity: "",
    });

    const handleMediumChange = (value: string) => {
        setSelectedMedium(value);
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
    };

    const isValidUrl = (url: string) => {
        const pattern =
            /^(https?:\/\/)?(?:[\w-]+\.)+[\w]{2,}(?:\/.*)?(?:\?.*)?$/;
        return pattern.test(url);
    };

    const validateFields = () => {
        const newErrors = {
            name: "",
            medium: "",
            url: "",
            status: "",
            capacity: "",
        };
        let valid = true;

        if (!name.trim()) {
            newErrors.name = "Room name is required";
            valid = false;
        }
        if (!selectedMedium.trim()) {
            newErrors.medium = "Type is required";
            valid = false;
        }
        if (selectedMedium !== "In-Person" && !url.trim()) {
            newErrors.url = "Url is required";
            valid = false;
        }
        if (selectedMedium !== "In-Person" && !isValidUrl(url)) {
            newErrors.url = "Invalid Url";
            valid = false;
        }
        if (!selectedStatus.trim()) {
            newErrors.status = "Status is required";
            valid = false;
        }
        if (Number.isNaN(Number(capacity))) {
            newErrors.capacity = "Capacity has to be a Number";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        setName("");
        setSelectedMedium("online");
        setUrl("");
        setCapacity("");
        setSelectedStatus("available");
        setDescription("");
        setNote("");
        setErrors({
            name: "",
            medium: "",
            url: "",
            status: "",
            capacity: "",
        });
        closePopup();
    };

    const handleAddRoomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!validateFields()) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/courses/room/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    medium: selectedMedium,
                    url,
                    capacity,
                    status: selectedStatus,
                    description,
                    note,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to add room in the course");
            }

            onRoomAdded();
            setName("");
            setSelectedMedium("online");
            setUrl("");
            setCapacity("");
            setSelectedStatus("available");
            setDescription("");
            setNote("");
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
                {t("add new room")}
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                method="POST"
                onSubmit={handleAddRoomSubmit}
            >
                <div className="flex w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="name">{t("roomName")}</label>
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                        <Input
                            id="name"
                            type="text"
                            placeholder={t("roomName")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="lastName">{t("capacity")}</label>
                        {errors.capacity && (
                            <p className="text-red-500 text-sm">
                                {errors.capacity}
                            </p>
                        )}
                        <Input
                            id="capacity"
                            type="text"
                            placeholder="100"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="status">{t("status")}</label>
                        {errors.status && (
                            <p className="text-red-500 text-sm">
                                {errors.status}
                            </p>
                        )}
                        <Select
                            value={selectedStatus}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Available" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status, index) => (
                                    <SelectItem
                                        key={index}
                                        value={status}
                                        className="capitalize"
                                    >
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="firstName">{t("type")}</label>
                        {errors.medium && (
                            <p className="text-red-500 text-sm">
                                {errors.medium}
                            </p>
                        )}
                        <Select
                            value={selectedMedium}
                            onValueChange={handleMediumChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Online" />
                            </SelectTrigger>
                            <SelectContent>
                                {mediums.map((medium, index) => (
                                    <SelectItem
                                        key={index}
                                        value={medium}
                                        className="capitalize"
                                    >
                                        {medium}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedMedium !== "In-Person" ? (
                        <div className="flex flex-col flex-1 gap-2">
                            <label htmlFor="lastName">URL</label>
                            {errors.url && (
                                <p className="text-red-500 text-sm">
                                    {errors.url}
                                </p>
                            )}
                            <Input
                                id="url"
                                type="text"
                                placeholder="https://example.zoom.us/12345"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col flex-1 gap-2"></div>
                    )}
                </div>
                <div className="flex flex-row w-full">
                    <div className="flex flex-col flex-1">
                        <label htmlFor="courseDescription">
                            {t("room description")}
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder={t("room description")}
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                        />
                    </div>
                </div>
                <div className="flex flex-row w-full">
                    <div className="flex flex-col flex-1">
                        <label htmlFor="courseDescription">
                            {t("internal note")}
                        </label>
                        <Textarea
                            id="note"
                            name="note"
                            placeholder={t("internal note")}
                            onChange={(e) => setNote(e.target.value)}
                            value={note}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row gap-2 mt-4">
                    <Button
                        type="submit"
                        className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4"
                        disabled={loading}
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
