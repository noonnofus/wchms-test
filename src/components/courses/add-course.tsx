import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { DatePicker } from "../ui/date-picker";
import { Button } from "../ui/button";
import { getAvailableRooms } from "@/db/queries/rooms";
import { Room } from "@/db/schema/room";
import { useRouter } from "next/navigation";

const defaultRoomName = "Online via Zoom"; //name of room for default selection
const [languages, types, statuses] = [
    // Change values here to change available select options
    ["English", "Japanese"],
    ["Group", "Individual"],
    ["Available", "Completed"],
];
export default function AddCourse({
    handleClosePopup,
}: {
    handleClosePopup: () => void;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
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

    const [formData, setFormData] = useState({
        courseName: "",
        courseImage: null as File | null,
        courseDescription: "",
        courseStartDate: undefined,
        courseEndDate: undefined,
        courseRoom: undefined as undefined | string,
        courseLanguage: "Japanese",
        courseType: "Group",
        courseStatus: "Available",
        courseParticipants: "",
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormData({
            ...formData,
            courseImage: file,
        });
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
        }
        // else {
        // errorMessages.courseParticipants = "Participants are required";
        // isValid = false;
        // }

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

        console.log(formData);
        const res = await fetch("/api/courses/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            const data = await res.json();
            const courseId = data.courseId;
            console.log("Form submitted successfully");

            router.push(`/courses/${courseId}`);
        } else {
            console.error("Form submission failed");
        }
    };

    return (
        <div className="flex flex-col gap-20 min-w-[360px] overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-4xl">Add New Course</h1>
            <form
                className="flex flex-col gap-4 w-full h-full md:text-2xl"
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
                    <div className="flex flex-col items-center justify-center bg-[#D9D9D9] h-[148px] w-full rounded-lg">
                        <svg
                            width="26"
                            height="24"
                            viewBox="0 0 26 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4.95508 16L9.60951 11.4142C10.4023 10.6332 11.6875 10.6332 12.4803 11.4142L17.1347 16M15.1048 14L16.7143 12.4142C17.507 11.6332 18.7923 11.6332 19.5851 12.4142L21.1946 14M15.1048 8H15.1149M6.98502 20H19.1647C20.2858 20 21.1946 19.1046 21.1946 18V6C21.1946 4.89543 20.2858 4 19.1647 4H6.98502C5.86391 4 4.95508 4.89543 4.95508 6V18C4.95508 19.1046 5.86391 20 6.98502 20Z"
                                stroke="#5D5D5D"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p>Click or drag to add a photo</p>
                    </div>
                    <Input
                        type="file"
                        id="courseImage"
                        name="courseImage"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
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
                    />
                </div>
                <div className="w-full flex flex-row gap-2">
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
                            value={formData.courseStartDate}
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
                            value={formData.courseEndDate}
                            onChange={(date) =>
                                handleDateChange("courseEndDate", date)
                            }
                        />
                    </div>
                </div>
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseRoom">Course Room</label>
                        <Select
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
                                                        room.name ===
                                                        defaultRoomName
                                                )?.name
                                              : rooms.find(
                                                    (room) =>
                                                        room.id.toString() ===
                                                        formData.courseRoom
                                                )?.name
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
                            onValueChange={(value) =>
                                handleSelectChange("courseLanguage", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Japanese" />
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
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseType">Course Type</label>
                        <Select
                            onValueChange={(value) =>
                                handleSelectChange("courseType", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Group" />
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
                            onValueChange={(value) =>
                                handleSelectChange("courseStatus", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Available" />
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
                <div className="w-full flex flex-row gap-2">
                    <Button className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-4">
                        Save
                    </Button>
                    <Button
                        onClick={handleClosePopup}
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
