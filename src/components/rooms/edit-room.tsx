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
import { Textarea } from "../ui/textarea";
import { Room } from "@/db/schema/room";
import { useTranslation } from "react-i18next";

const mediums = ["Online", "In-Person"];
const statuses = ["Available", "Unavailable"];

export default function EditRoom({
    closePopup,
    roomData,
    onRoomUpdated,
}: {
    closePopup: () => void;
    roomData: Room;
    onRoomUpdated: () => void;
}) {
    const { t } = useTranslation();
    const [name, setName] = useState(roomData.name);
    const [medium, setMedium] = useState<string>(
        roomData.medium === "online" ? "Online" : "In-Person"
    );
    const [url, setUrl] = useState(roomData.url);
    const [capacity, setCapacity] = useState<string>(String(roomData.capacity));
    const [status, setStatus] = useState<string>(
        roomData.status === "available" ? "Available" : "Unavailable"
    );
    const [description, setDescription] = useState(roomData.description);
    const [note, setNote] = useState(roomData.internalNote);
    const [errors, setErrors] = useState({
        name: "",
        medium: "",
        status: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(roomData.name);
        setMedium(roomData.medium === "online" ? "Online" : "In-Person");
        setUrl(roomData.url);
        setCapacity(String(roomData.capacity));
        setStatus(
            roomData.status === "available" ? "Available" : "Unavailable"
        );
        setDescription(roomData.description);
        setNote(roomData.internalNote);
    }, [roomData]);

    const handleMediumChange = (medium: string) => {
        setMedium(medium);
    };

    const handleStatusChange = (status: string) => {
        setStatus(status);
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        closePopup();
    };

    const validateFields = () => {
        const newErrors = {
            name: "",
            medium: "",
            status: "",
        };
        let valid = true;

        if (!name.trim()) {
            newErrors.name = "Room name is required";
            valid = false;
        }
        if (!medium.trim()) {
            newErrors.medium = "Medium is required";
            valid = false;
        }
        if (!status.trim()) {
            newErrors.status = "Status is required";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleEditRoomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateFields()) return;

        setLoading(true);

        try {
            const response = await fetch(`/api/courses/room/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: roomData.id,
                    name: name,
                    medium: medium,
                    url: url,
                    capacity: capacity,
                    status: status,
                    description: description,
                    internalNote: note,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update room");
            }

            onRoomUpdated();
            closePopup();
        } catch (error) {
            console.error("Error updating room:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-12 overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                {t("edit room")}
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                method="POST"
                onSubmit={handleEditRoomSubmit}
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
                        <label htmlFor="firstName">{t("type")}</label>
                        {errors.medium && (
                            <p className="text-red-500 text-sm">
                                {errors.medium}
                            </p>
                        )}
                        <Select
                            value={medium}
                            onValueChange={handleMediumChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={medium} />
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
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="lastName">URL</label>
                        <Input
                            id="url"
                            type="text"
                            placeholder="https://example.zoom.us/12345"
                            value={url ? url : ""}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="lastName">{t("capacity")}</label>
                        <Input
                            id="capacity"
                            type="text"
                            placeholder="100"
                            value={capacity ? capacity : ""}
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
                            value={status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={status} />
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
                            value={description ? description : ""}
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
                            value={note ? note : ""}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row gap-2 mt-4">
                    <Button
                        type="submit"
                        className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4"
                        disabled={loading}
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
