"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getCourseById } from "@/db/queries/courses";
import { getAvailableRooms } from "@/db/queries/rooms";
import { Room } from "@/db/schema/room";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import ImageUpload from "../ui/image-upload";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import CloseIcon from "../icons/close-icon";

const defaultRoomName = "Online via Zoom"; //name of room for default selection
export const [languages, types, statuses] = [
    // Change values here to change available select options
    ["English", "Japanese"],
    ["Group", "Individual"],
    ["Available", "Completed"],
];

interface props {
    handleClosePopup: () => void;
    courseId?: number;
}

export default function AddCourse(props: props) {
    const path = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const availableRooms = await getAvailableRooms();
                setRooms(availableRooms);
                setFormData({
                    ...formData,
                    courseRoom:
                        availableRooms
                            .find((room) => room.name === defaultRoomName)
                            ?.id.toString() || "-1",
                });
            } catch (error) {
                console.error("Error fetching rooms:", error);
                setRooms([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        if (props.courseId) {
            const fetchCourse = async () => {
                try {
                    const course = await getCourseById(props.courseId!).then(
                        (res) => res[0]
                    );
                    setFormData({
                        ...formData,
                        courseId: course.id,
                        courseName: course.title,
                        courseDescription: course.description || "",
                        courseStartDate: new Date(course.start),
                        courseEndDate: new Date(course.end!),
                        courseRoom: course.roomId?.toString(),
                        courseLanguage: course.lang,
                        courseType: course.kind,
                        courseStatus: course.status,
                        uploadId: course.uploadId?.toString() || null,
                    });
                } catch (error) {
                    console.error("Error fetching course data:", error);
                }
            };

            fetchCourse();
        }
    }, [props.courseId]);

    const [formData, setFormData] = useState({
        courseId: null as number | null,
        courseName: "",
        courseImage: null as File | null,
        courseDescription: "",
        courseStartDate: null as Date | null,
        courseEndDate: null as Date | null,
        courseRoom: undefined as undefined | string,
        courseLanguage: "Japanese",
        courseType: "Group",
        courseStatus: "Available",
        courseParticipants: "",
        uploadId: null as string | null,
    });

    const [errors, setErrors] = useState({
        courseName: "",
        courseImage: "",
        courseDescription: "",
        courseStartDate: "",
        courseEndDate: "",
        courseParticipants: "",
    });

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
        });
    };
    const handleImageSelect = (file: File | null) => {
        setFormData((prev) => ({
            ...formData,
            courseImage: file,
        }));
    };

    const handleDateChange = (name: string, date: Date | undefined) => {
        setFormData({
            ...formData,
            [name]: date,
        });
    };

    const validateForm = () => {
        let isValid = true;
        let errorMessages: any = {};

        if (!formData.courseName) {
            errorMessages.courseName = "Course name is required";
            isValid = false;
        } else if (formData.courseName.length > 255) {
            errorMessages.courseName = `Course name cannot exceed 255 characters. Current count: ${formData.courseName.length}/255`;
            isValid = false;
        }

        if (!formData.courseDescription) {
            errorMessages.courseDescription = "Course description is required";
            isValid = false;
        } else if (formData.courseDescription.length > 255) {
            errorMessages.courseDescription = `Course Description cannot exceed 255 characters. Current count: ${formData.courseDescription.length}/255`;
            isValid = false;
        }

        if (!formData.courseStartDate) {
            errorMessages.courseStartDate = "Start date is required";
            isValid = false;
        }

        if (!formData.courseEndDate) {
            errorMessages.courseEndDate = "End date is required";
            isValid = false;
        } else if (formData.courseStartDate && formData.courseEndDate) {
            // Check if end date is after start date
            const startDate = new Date(formData.courseStartDate);
            const endDate = new Date(formData.courseEndDate);

            if (endDate <= startDate) {
                errorMessages.courseEndDate =
                    "End date must be after start date";
                isValid = false;
            }
        }

        // Validate course participants (comma-separated list)
        if (formData.courseParticipants) {
            const participantsRegex = /^[a-zA-Z\s]+(?:,\s*[a-zA-Z\s]+)*$/;
            if (!participantsRegex.test(formData.courseParticipants)) {
                errorMessages.courseParticipants =
                    "Participants must be a comma-separated list of names (e.g., 'John Kim, Kelly Zo')";
                isValid = false;
            }
            console.log(formData.courseParticipants);
        }

        if (!formData.courseRoom || formData.courseRoom === "-1") {
            errorMessages.courseRoom = "Please select a valid room";
            isValid = false;
        }

        setErrors(errorMessages);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsUploading(true);
        try {
            let updatedFormData = { ...formData };

            // Only upload image if there's a new image to upload
            if (formData.courseImage) {
                const imageFormData = new FormData();
                imageFormData.append("file", formData.courseImage);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: imageFormData,
                });

                if (!uploadRes.ok) {
                    throw new Error("Failed to upload image");
                }

                const uploadData = await uploadRes.json();
                updatedFormData.uploadId = uploadData.id;
            }

            const res = await fetch("/api/courses/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Form submitted successfully");
                sessionStorage.setItem(
                    "unaddedParticipants",
                    JSON.stringify(data.unaddedParticipants)
                );
                router.push(`/admin/courses/${data.courseId}`);
            } else {
                throw new Error("Failed to create course");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrors((prev) => ({
                ...prev,
                courseImage:
                    error instanceof Error
                        ? error.message
                        : "Failed to process image",
            }));
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        let updatedFormData = { ...formData };

        if (formData.courseImage instanceof File) {
            const imageFormData = new FormData();
            imageFormData.append("file", formData.courseImage);
            imageFormData.append("courseId", String(formData.courseId));

            try {
                const uploadRes = await fetch("/api/updateImage", {
                    method: "POST",
                    body: imageFormData,
                });

                if (!uploadRes.ok) {
                    throw new Error("Failed to upload image");
                }

                const uploadData = await uploadRes.json();
                updatedFormData.uploadId = uploadData.id;
            } catch (error) {
                console.error("Error uploading image:", error);
                return;
            }
        }

        console.log(updatedFormData);

        const res = await fetch("/api/courses/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
        });

        if (res.ok) {
            const data = await res.json();
            const courseId = data.courseId;
            console.log("Course updated successfully");

            if (path.startsWith("/admin/courses/")) {
                return (window.location.href = `/admin/courses/${courseId}`);
            }

            router.push(`/admin/courses/${courseId}`);
        } else {
            console.error("Form submission failed");
        }
    };

    return (
        <div className="flex flex-col gap-12 w-full h-full py-8 px-6 rounded-lg bg-white items-center justify-center">
            <div className="relative w-full flex flex-row items-center justify-center">
                <div className="w-1/3 md:hidden border-b-2 border-black"></div>
                <button onClick={props.handleClosePopup}>
                    <CloseIcon className="absolute -top-3 right-0" />
                </button>
            </div>
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                {props.courseId ? "Edit Course" : "Add New Course"}
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseName">Course Name</label>
                        {errors.courseName && (
                            <p className="text-red-500 text-sm">
                                {errors.courseName}
                            </p>
                        )}
                        <Input
                            id="courseName"
                            name="courseName"
                            type="text"
                            placeholder="Course Name"
                            value={formData.courseName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="courseImage">Course Image</label>
                    {errors.courseImage && (
                        <p className="text-red-500 text-sm">
                            {errors.courseImage}
                        </p>
                    )}
                    <ImageUpload
                        uploadId={
                            formData.uploadId
                                ? String(formData.uploadId)
                                : undefined
                        }
                        onImageSelect={handleImageSelect}
                        error={errors.courseImage}
                    />
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="courseDescription">
                        Course Description
                    </label>
                    {errors.courseDescription && (
                        <p className="text-red-500 text-sm">
                            {errors.courseDescription}
                        </p>
                    )}
                    <Textarea
                        id="courseDescription"
                        name="courseDescription"
                        placeholder="Course Description"
                        onChange={handleChange}
                        value={formData.courseDescription}
                    />
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseStartDate">
                            Course Start Date
                        </label>
                        {errors.courseStartDate && (
                            <p className="text-red-500 text-sm">
                                {errors.courseStartDate}
                            </p>
                        )}
                        <DatePicker
                            selected={formData.courseStartDate}
                            onChange={(date) =>
                                handleDateChange("courseStartDate", date)
                            }
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseEndDate">Course End Date</label>
                        {errors.courseEndDate && (
                            <p className="text-red-500 text-sm">
                                {errors.courseEndDate}
                            </p>
                        )}
                        <DatePicker
                            selected={formData.courseEndDate}
                            onChange={(date) =>
                                handleDateChange("courseEndDate", date)
                            }
                        />
                    </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseRoom">Course Room</label>
                        <Select
                            value={formData.courseRoom}
                            onValueChange={(value) =>
                                handleSelectChange("courseRoom", value)
                            }
                            disabled={isLoading} // Disable select while loading
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        isLoading
                                            ? "Loading rooms..."
                                            : formData.courseRoom
                                              ? rooms.find(
                                                    (room) =>
                                                        room.id.toString() ===
                                                        formData.courseRoom
                                                )?.name
                                              : defaultRoomName
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoading ? (
                                    <SelectItem value={"-1"} disabled>
                                        Loading...
                                    </SelectItem>
                                ) : rooms.length > 0 ? (
                                    rooms.map((room) => (
                                        <SelectItem
                                            key={room.id}
                                            value={String(room.id)}
                                        >
                                            {room.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value={"-1"} disabled>
                                        No rooms available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseLanguage">Course Language</label>
                        <Select
                            value={formData.courseLanguage}
                            onValueChange={(value) =>
                                handleSelectChange("courseLanguage", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        formData.courseLanguage ||
                                        "Select Language"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((language, index) => (
                                    <SelectItem key={index} value={language}>
                                        {language}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseType">Course Type</label>
                        <Select
                            value={formData.courseType}
                            onValueChange={(value) =>
                                handleSelectChange("courseType", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        formData.courseType || "Select Type"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((type, index) => (
                                    <SelectItem key={index} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseStatus">Course Status</label>
                        <Select
                            value={formData.courseStatus}
                            onValueChange={(value) =>
                                handleSelectChange("courseStatus", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        formData.courseStatus || "Select Status"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status, index) => (
                                    <SelectItem key={index} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {!props.courseId && (
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseParticipants">Participants</label>
                        {errors.courseParticipants && (
                            <p className="text-red-500 text-sm">
                                {errors.courseParticipants}
                            </p>
                        )}
                        <Textarea
                            id="courseParticipants"
                            name="courseParticipants"
                            value={formData.courseParticipants}
                            onChange={handleChange}
                            placeholder="Enter participants' full names, ex. Kevin So, Annabelle Chen"
                        />
                    </div>
                )}
                <div className="w-full flex flex-row gap-2 mt-4">
                    {props.courseId ? (
                        <Button
                            onClick={handleUpdate}
                            className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4"
                        >
                            Update
                        </Button>
                    ) : (
                        <Button className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4">
                            Save
                        </Button>
                    )}
                    <Button
                        onClick={props.handleClosePopup}
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
