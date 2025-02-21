import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import TabsMenu from "../shared/tabs-menu";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";

const activities = ["Simple Arithmetic", "Reading Aloud", "Physical Exercise"];
const difficulties = ["Basic", "Intermediate"];
type Errors = {
    title: string;
    exerciseType: string;
    exerciseDifficulty: string;
    description: string;
};

export default function AddMaterial(props: { handleClosePopup: () => void }) {
    const courseId = useParams().id;
    const [selectedActivity, setSelectedActivity] = useState<string>(
        activities[0]
    );
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>(
        difficulties[0]
    );
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({
        title: "",
        exerciseType: "",
        exerciseDifficulty: "",
        description: "",
    });

    const handleActivitySelect = (activity: string) => {
        setSelectedActivity(activity);
    };

    const handleDifficultySelect = (difficulty: string) => {
        setSelectedDifficulty(difficulty);
    };

    const validateForm = () => {
        const newErrors: Errors = {
            title: "",
            exerciseType: "",
            exerciseDifficulty: "",
            description: "",
        };

        if (!title) newErrors.title = "Title is required.";
        if (!description) newErrors.description = "Description is required.";
        if (!selectedActivity)
            newErrors.exerciseType = "Please select an activity.";
        if (!selectedDifficulty)
            newErrors.exerciseDifficulty = "Please select a difficulty.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // If no errors, form is valid
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Stop form submission if validation fails
        }

        const data = {
            title,
            exerciseType: selectedActivity,
            difficulty: selectedDifficulty,
            description,
            courseId,
        };

        try {
            const response = await fetch("/api/courses/materials/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log("Course material added successfully!");
                props.handleClosePopup();
            } else {
                console.log("Failed to add course material");
            }
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    return (
        <div className="flex flex-col gap-12 w-full h-full py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="mt-4 font-semibold text-3xl md:text-4xl text-center">
                Add New Course Material
            </h1>
            <TabsMenu
                tabsListClassName="w-full flex justify-center border-b"
                leftLabel="Manual"
                rightLabel="With AI"
                leftChildren={
                    <form
                        className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col flex-1 gap-2">
                            <label htmlFor="title">Title</label>
                            {errors.title && (
                                <p className="text-red-500 text-sm">
                                    {errors.title}
                                </p>
                            )}
                            <Input
                                id="title"
                                type="text"
                                placeholder="ex. Week 1: In-class math activity"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 items-center w-full">
                            <div className="flex flex-col w-full">
                                <label htmlFor="exerciseType">
                                    Exercise Type
                                </label>
                                {errors.exerciseType && (
                                    <p className="text-red-500 text-sm">
                                        {errors.exerciseType}
                                    </p>
                                )}
                                <Select onValueChange={handleActivitySelect}>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={selectedActivity}
                                            placeholder={selectedActivity}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activities.map((activity) => (
                                            <SelectItem
                                                key={activity}
                                                value={activity}
                                            >
                                                {activity}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="exerciseDifficulty">
                                    Exercise Difficulty
                                </label>
                                {errors.exerciseDifficulty && (
                                    <p className="text-red-500 text-sm">
                                        {errors.exerciseDifficulty}
                                    </p>
                                )}
                                <Select onValueChange={handleDifficultySelect}>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={selectedDifficulty}
                                            placeholder={selectedDifficulty}
                                        />
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
                                onChange={() => {}}
                            />
                        </div>
                        <div className="flex flex-col flex-1 gap-2">
                            <label htmlFor="ExerciseInstructions">
                                Exercise Instructions
                            </label>
                            {errors.description && (
                                <p className="text-red-500 text-sm">
                                    {errors.description}
                                </p>
                            )}
                            <Textarea
                                id="ExerciseInstructions"
                                placeholder="Exercise Instructions (Optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="w-full flex flex-row gap-2 mt-4">
                            <Button
                                type="submit"
                                className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-2 md:py-4"
                            >
                                Save
                            </Button>
                            <Button
                                onClick={props.handleClosePopup}
                                variant="outline"
                                className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold py-2 md:py-4"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                }
                rightChildren={
                    <form className="flex flex-col gap-4 w-full h-full md:text-2xl">
                        <div className="flex flex-col flex-1 gap-2">
                            <label htmlFor="title">Title</label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="ex. Week 1: In-class math activity"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 items-center w-full">
                            <div className="flex flex-col w-full">
                                <label htmlFor="exerciseType">
                                    Exercise Type
                                </label>
                                <Select onValueChange={handleActivitySelect}>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={selectedActivity}
                                            placeholder={selectedActivity}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activities
                                            .filter(
                                                (activity) =>
                                                    activity !==
                                                    "Physical Exercise"
                                            )
                                            .map((activity) => (
                                                <SelectItem
                                                    key={activity}
                                                    value={activity}
                                                >
                                                    {activity}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="exerciseDifficulty">
                                    Exercise Difficulty
                                </label>
                                <Select onValueChange={handleDifficultySelect}>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={selectedDifficulty}
                                            placeholder={selectedDifficulty}
                                        />
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
                        {selectedActivity === "Reading Aloud" && (
                            <div className="flex flex-col flex-1 gap-2">
                                <label htmlFor="topic">Topic</label>
                                <Textarea
                                    id="topic"
                                    placeholder="Topic for the reading exercise"
                                />
                            </div>
                        )}
                        <div className="w-full flex flex-row gap-2 mt-4">
                            <Button className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-2 md:py-4">
                                Save
                            </Button>
                            <Button
                                onClick={props.handleClosePopup}
                                variant="outline"
                                className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold py-2 md:py-4"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                }
            />
        </div>
    );
}
