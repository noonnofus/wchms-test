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

const categories = ["Category 1", "Category 2"];

export default function AddCourse() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const handleCourseSelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
    };

    return (
        <div className="flex flex-col gap-20 w-[720px] h-[940px] bg-white items-center justify-center">
            <h1 className="font-semibold text-4xl">Add New Course</h1>
            <div className="flex flex-col gap-4 w-full h-full">
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex-1">
                        <label htmlFor="courseName">Course Name</label>
                        <Input
                            id="courseName"
                            type="text"
                            placeholder="Course Name"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="courseCategory">Course Category</label>
                        <Select onValueChange={handleCourseSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Courses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Courses">
                                    All Courses
                                </SelectItem>
                                {categories.map((category, index) => (
                                    <SelectItem key={index} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
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
                    <Input id="courseImage" className="hidden"></Input>
                </div>
                <label htmlFor="courseDescription">Course Description</label>
                <Textarea
                    id="courseDescription"
                    placeholder="Course Description"
                />
                <div className="flex flex-row gap-2">
                    <label htmlFor="courseStartDate">Course Start Date</label>
                    <label htmlFor="courseEndDate">Course End Date</label>
                </div>
            </div>
        </div>
    );
}
