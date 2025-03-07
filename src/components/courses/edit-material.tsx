"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CourseMaterialsWithFile } from "@/db/schema/courseMaterials";
import { CourseFull } from "@/db/schema/course";

const activities = ["Simple Arithmetic", "Reading Aloud", "Physical Exercise"];
const difficulties = ["Basic", "Intermediate"];

export default function EditMaterial({
    handleClosePopup,
    material,
    setSelectedCourse,
}: {
    handleClosePopup: () => void;
    material: CourseMaterialsWithFile;
    setSelectedCourse: Dispatch<SetStateAction<CourseFull | undefined>>;
}) {
    const [title, setTitle] = useState<string>(material.title);
    const [selectedActivity, setSelectedActivity] = useState<string>(
        material.type
    );
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>(
        material.difficulty
    );
    const [description, setDescription] = useState<string>(
        material.description || ""
    );
    const [url, setUrl] = useState<string>(material.url || "");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        console.log("material at edit material: ", material);
    }, []);

    const handleActivitySelect = (activity: string) => {
        setSelectedActivity(activity);
    };

    const handleDifficultySelect = (difficulty: string) => {
        setSelectedDifficulty(difficulty);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            id: material.id,
            title,
            exerciseType: selectedActivity,
            difficulty: selectedDifficulty,
            description,
            uploadId: material.uploadId,
            courseId: material.courseId,
            url: url,
        };

        const response = await fetch(`/api/courses/materials/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log("Material updated successfully");
            const updatedMaterial: CourseMaterialsWithFile =
                responseData.data.updatedMaterial;
            setSelectedCourse((prevSelectedCourse: CourseFull | undefined) => {
                if (prevSelectedCourse) {
                    return {
                        ...prevSelectedCourse,
                        materials: prevSelectedCourse.materials
                            ? prevSelectedCourse.materials.map((material) =>
                                  material.id === updatedMaterial.id
                                      ? { ...material, ...updatedMaterial }
                                      : material
                              )
                            : [],
                    } as CourseFull;
                } else {
                    return undefined;
                }
            });
            handleClosePopup();
        } else {
            console.error("Failed to update material");
        }
    };

    return (
        <div className="flex flex-col gap-12 w-full h-full py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="font-semibold text-3xl md:text-4xl text-center">
                Edit Course Material
            </h1>
            <form
                className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="title">Title</label>
                    <Input
                        id="title"
                        type="text"
                        placeholder="ex. Week 1: In-class math activity"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-2 items-center w-full">
                    <div className="flex flex-col flex-1 w-full">
                        <label htmlFor="exerciseType">Exercise Type</label>
                        <Select onValueChange={handleActivitySelect}>
                            <SelectTrigger>
                                <SelectValue placeholder={selectedActivity} />
                            </SelectTrigger>
                            <SelectContent>
                                {activities.map((activity) => (
                                    <SelectItem key={activity} value={activity}>
                                        {activity}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col flex-1 w-full">
                        <label htmlFor="exerciseDifficulty">
                            Exercise Difficulty
                        </label>
                        <Select onValueChange={handleDifficultySelect}>
                            <SelectTrigger>
                                <SelectValue placeholder={selectedDifficulty} />
                            </SelectTrigger>
                            <SelectContent>
                                {difficulties.map((difficulty) => (
                                    <SelectItem
                                        key={difficulty}
                                        value={difficulty}
                                    >
                                        {difficulty}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    {material.file ? (
                        <>
                            <div className="relative">
                                <div className="self-center flex flex-col justify-center items-center py-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="22"
                                        viewBox="0 0 24 22"
                                        fill="none"
                                        className="relative"
                                    >
                                        <g filter="url(#filter0_d_1418_619)">
                                            <path
                                                d="M7 19H17C18.1046 19 19 18.1046 19 17V7.41421C19 7.149 18.8946 6.89464 18.7071 6.70711L13.2929 1.29289C13.1054 1.10536 12.851 1 12.5858 1H7C5.89543 1 5 1.89543 5 3V17C5 18.1046 5.89543 19 7 19Z"
                                                stroke="#545F71"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                shapeRendering="crispEdges"
                                            />
                                        </g>
                                    </svg>
                                    <p>{material.file.fileName}</p>
                                    <div className="absolute top-0 right-0 flex items-center gap-2 stroke-destructive-text">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <label htmlFor="courseMaterial">
                                Course Material
                                <div className="flex flex-col items-center justify-center bg-[#D9D9D9] h-[148px] w-full rounded-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="26"
                                        height="24"
                                        viewBox="0 0 26 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M8.00002 16C5.7512 16 3.92816 14.2091 3.92816 12C3.92816 10.0929 5.2867 8.4976 7.10493 8.09695C7.02449 7.74395 6.98206 7.37684 6.98206 7C6.98206 4.23858 9.26085 2 12.0719 2C14.5346 2 16.5889 3.71825 17.0601 6.00098C17.0939 6.00033 17.1278 6 17.1617 6C19.9727 6 22.2515 8.23858 22.2515 11C22.2515 13.419 20.5029 15.4367 18.1797 15.9M16.1437 13L13.0898 10M13.0898 10L10.0359 13M13.0898 10L13.0898 22"
                                            stroke="#5D5D5D"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <p>Click or drag to add a file</p>
                                </div>
                            </label>
                            <Input
                                type="file"
                                id="courseMaterial"
                                className="hidden"
                                accept="application/pdf, image/*"
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                </div>
                {selectedActivity === "Physical Exercise" && (
                    <div className="flex flex-col flex-1 gap-2">
                        <label htmlFor="url">Video URL</label>
                        <Input
                            id="url"
                            value={url}
                            type="url"
                            placeholder="ex. https://www.example.com"
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                )}
                <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="ExerciseInstructions">
                        Exercise Instructions
                    </label>
                    <Textarea
                        id="ExerciseInstructions"
                        placeholder="Exercise Instructions (Optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="w-full flex flex-row gap-2 mt-4">
                    <Button className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold md:text-xl py-2 md:py-4">
                        Save
                    </Button>
                    <Button
                        onClick={handleClosePopup}
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
