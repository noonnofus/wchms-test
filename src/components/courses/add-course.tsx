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
import { Textarea } from "../ui/textarea";
import { DatePicker } from "../ui/date-picker";
import { Button } from "../ui/button";

const categories = ["Category 1", "Category 2"];
const rooms = ["Online via Zoom", "Burnaby"];
const languages = ["Japanese", "English"];
const types = ["Group", "Individual"];
const statuses = ["Available", "Archived", "Completed"];

export default function AddCourse() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
        null
    );
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const handleCourseSelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
    };

    const handleRoomSelect = (courseRoom: string) => {
        setSelectedRoom(courseRoom);
    };

    const handleLanguageSelect = (courseLangauge: string) => {
        setSelectedLanguage(courseLangauge);
    };

    const handleTypeSelect = (courseType: string) => {
        setSelectedType(courseType);
    };

    const handleStatusSelect = (courseStatus: string) => {
        setSelectedStatus(courseStatus);
    };

    return (
        <div className="flex flex-col gap-20 min-w-[360px] overflow-y-auto py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-4xl">Add New Course</h1>
            <form className="flex flex-col gap-4 w-full h-full md:text-2xl">
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseName">Course Name</label>
                        <Input
                            id="courseName"
                            type="text"
                            placeholder="Course Name"
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseCategory">Course Category</label>
                        <Select onValueChange={handleCourseSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="Course Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category, index) => (
                                    <SelectItem key={index} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="courseImage">
                        Course Image
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
                    </label>
                    <Input
                        type="file"
                        id="courseImage"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files
                                ? e.target.files[0]
                                : null;
                            console.log(file);
                        }}
                    ></Input>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="courseDescription">
                        Course Description
                    </label>
                    <Textarea
                        id="courseDescription"
                        placeholder="Course Description"
                    />
                </div>
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseStartDate">
                            Course Start Date
                        </label>
                        <DatePicker />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseEndDate">Course End Date</label>
                        <DatePicker />
                    </div>
                </div>
                <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseRoom">Course Room</label>
                        <Select onValueChange={handleRoomSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="Online via Zoom" />
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.map((room, index) => (
                                    <SelectItem key={index} value={room}>
                                        {room}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="courseLanguage">Course Language</label>
                        <Select onValueChange={handleLanguageSelect}>
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
                        <label htmlFor="coursetype">Course Type</label>
                        <Select onValueChange={handleTypeSelect}>
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
                        <label htmlFor="courseLanguage">Course Status</label>
                        <Select onValueChange={handleStatusSelect}>
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
                    <Textarea
                        id="courseParticipant"
                        placeholder="Enter participants' full names, ex. Kevin So, Annabelle Chen"
                    />
                </div>
                <div className="w-full flex flex-row gap-2">
                    <Button className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-4">
                        Save
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
