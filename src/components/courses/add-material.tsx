import { Dispatch, SetStateAction, useState } from "react";
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
import { CourseFull } from "@/db/schema/course";
import { CourseMaterialsWithFile } from "@/db/schema/courseMaterials";
import PDFDocument from "./reading-material-pdf";
import PDFMath from "./arithmetic-material-pdf";
import { pdf } from "@react-pdf/renderer";
import CourseMaterialUpload from "../ui/course-material-upload";
import { useTranslation } from "react-i18next";

const activities = ["Simple Arithmetic", "Reading Aloud", "Physical Exercise"];
const difficulties = ["Basic", "Intermediate"];
type Errors = {
    title?: string;
    exerciseType?: string;
    exerciseDifficulty?: string;
    description?: string;
    exerciseUrl?: string;
    topic?: string;
};

export default function AddMaterial(props: {
    handleClosePopup: () => void;
    setSelectedCourse: Dispatch<SetStateAction<CourseFull | undefined>>;
}) {
    const { t } = useTranslation();
    const courseId = useParams().id as string;
    const [selectedActivity, setSelectedActivity] = useState<string>(
        activities[0]
    );
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>(
        difficulties[0]
    );
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [topic, setTopic] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const handleActivitySelect = (activity: string) => {
        setSelectedActivity(activity);
    };

    const handleDifficultySelect = (difficulty: string) => {
        setSelectedDifficulty(difficulty);
    };

    const validateForm = () => {
        const newErrors: Errors = {};

        if (!title) newErrors.title = t("error.missingTitle");
        if (!selectedActivity)
            newErrors.exerciseType = t("error.missingActivity");
        if (!selectedDifficulty)
            newErrors.exerciseDifficulty = t("error.missingDifficulty");
        if (
            url &&
            !/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/.test(
                url
            )
        )
            newErrors.exerciseUrl = t("error.invalidURL");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateFormForAi = () => {
        const newErrors: Errors = {};

        if (!title) newErrors.title = t("error.missingTitle");
        if (!selectedActivity)
            newErrors.exerciseType = t("error.missingActivity");
        if (!selectedDifficulty)
            newErrors.exerciseDifficulty = t("error.missingDifficulty");
        if (selectedActivity === "Reading Aloud" && !topic) {
            newErrors.topic = t("error.missingTopic");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAiBtnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFormForAi()) {
            return;
        }

        setLoading(true);

        const activityConfig: Record<
            string,
            { url: string; payload: { level: string; topic?: string } }
        > = {
            "Reading Aloud": {
                url: "/api/homework/reading",
                payload: { level: selectedDifficulty, topic: topic },
            },
            "Simple Arithmetic": {
                url: "/api/homework/arithmetics",
                payload: { level: selectedDifficulty },
            },
        };

        const { url: fetchUrl, payload } =
            activityConfig[selectedActivity] || {};

        if (!fetchUrl) {
            console.error("Invalid activity type");
            return;
        }

        const res = await fetch(fetchUrl, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            }),
        });

        const data = await res.json();
        const result = JSON.parse(data.result);

        const pdfComponent =
            selectedActivity === "Reading Aloud" ? (
                <PDFDocument
                    title={title}
                    content={result.reading.join("\n\n")}
                />
            ) : (
                <PDFMath
                    title={title}
                    difficulty={selectedDifficulty}
                    contents={result.questions}
                />
            );

        const pdfBlob = await pdf(pdfComponent).toBlob();

        const formData = new FormData();
        formData.append("file", pdfBlob, `document_${Date.now()}.pdf`);

        const fetchResult = await fetchMaterialPDF(formData);

        handleSubmit(e, fetchResult?.uploadId, fetchResult?.returnUrl);
    };

    const fetchMaterialPDF = async (formData: FormData) => {
        try {
            const res = await fetch("/api/courses/materials/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            return { uploadId: data.uploadId, returnUrl: data.url };
        } catch (error) {
            console.error(error);
            return;
        }
    };

    const handleSubmit = async (
        e: React.FormEvent,
        uploadId?: number,
        passUrl?: string
    ) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        const data = {
            title,
            exerciseType: selectedActivity,
            difficulty: selectedDifficulty,
            description,
            courseId,
            url: passUrl || url || null,
            uploadId,
            file,
        };

        const parsedFormData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                parsedFormData.append(key, value);
            } else if (value !== null && value !== undefined) {
                parsedFormData.append(key, value.toString());
            }
        });

        try {
            const response = await fetch("/api/courses/materials/create", {
                method: "POST",
                body: parsedFormData,
            });

            if (response.ok) {
                const responseData = await response.json();
                const newMaterial: CourseMaterialsWithFile = responseData.data;
                props.setSelectedCourse(
                    (prevSelectedCourse: CourseFull | undefined) => {
                        if (prevSelectedCourse) {
                            return {
                                ...prevSelectedCourse,
                                materials: [
                                    newMaterial,
                                    ...(prevSelectedCourse.materials || []),
                                ] as CourseMaterialsWithFile[],
                            };
                        } else {
                            return undefined;
                        }
                    }
                );
                setLoading(false);
                props.handleClosePopup();
            } else {
                throw new Error("Failed to add course material");
            }
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    return (
        <div className="flex flex-col gap-12 w-full h-full py-8 px-6 rounded-lg bg-white items-center justify-center">
            <h1 className="mt-4 font-semibold text-3xl md:text-4xl text-center">
                {t("add new course material")}
            </h1>
            <TabsMenu
                tabsListClassName="w-full flex justify-center border-b"
                leftLabel={t("manual")}
                rightLabel={t("withAI")}
                leftChildren={
                    <form
                        className="flex flex-col gap-4 md:gap-6 w-full h-full md:text-2xl"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col flex-1 gap-2">
                            <label htmlFor="title">{t("title")}</label>
                            {errors.title && (
                                <p className="text-red-500 text-sm">
                                    {errors.title}
                                </p>
                            )}
                            <Input
                                id="title"
                                type="text"
                                placeholder={t("placeholder.exerciseTitle")}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 items-center w-full">
                            <div className="flex flex-col w-full">
                                <label htmlFor="exerciseType">
                                    {t("exercise type")}
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
                                            placeholder={t(
                                                `${selectedActivity.toLowerCase()}`
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activities.map((activity) => (
                                            <SelectItem
                                                key={activity}
                                                value={activity}
                                            >
                                                {t(`${activity.toLowerCase()}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="exerciseDifficulty">
                                    {t("exercise difficulty")}
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
                                            placeholder={t(
                                                `${selectedDifficulty.toLowerCase()}`
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {difficulties.map((difficulty) => (
                                            <SelectItem
                                                key={difficulty}
                                                value={difficulty}
                                            >
                                                {t(
                                                    `${difficulty.toLowerCase()}`
                                                )}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {selectedActivity !== "Physical Exercise" && (
                            <div className="flex flex-col flex-1 gap-2">
                                <CourseMaterialUpload
                                    fileUrl={null}
                                    onFileSelect={setFile}
                                />
                            </div>
                        )}
                        {selectedActivity === "Physical Exercise" && (
                            <div className="flex flex-col flex-1 gap-2">
                                <label htmlFor="url">{t("videoURL")}</label>
                                {errors.exerciseUrl && (
                                    <p className="text-red-500 text-sm">
                                        {errors.exerciseUrl}
                                    </p>
                                )}
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
                                {t("exercise instructions")}
                            </label>
                            {errors.description && (
                                <p className="text-red-500 text-sm">
                                    {errors.description}
                                </p>
                            )}
                            <Textarea
                                id="ExerciseInstructions"
                                placeholder={t(
                                    "placeholder.exerciseInstructions"
                                )}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="w-full flex flex-row gap-2 mt-4">
                            <Button
                                onClick={handleSubmit}
                                className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-2 md:py-4"
                            >
                                {t("add")}
                            </Button>
                            <Button
                                onClick={props.handleClosePopup}
                                variant="outline"
                                className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold py-2 md:py-4"
                            >
                                {t("button.cancel")}
                            </Button>
                        </div>
                    </form>
                }
                rightChildren={
                    <form className="flex flex-col gap-4 w-full h-full md:text-2xl">
                        <div className="flex flex-col flex-1 gap-2">
                            <label htmlFor="title">{t("title")}</label>
                            {errors.title && (
                                <p className="text-red-500 text-sm">
                                    {errors.title}
                                </p>
                            )}
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                placeholder={t("placeholder.exerciseTitle")}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 items-center w-full">
                            <div className="flex flex-col w-full">
                                <label htmlFor="exerciseType">
                                    {t("exercise type")}
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
                                            placeholder={t(
                                                `${selectedActivity.toLowerCase()}`
                                            )}
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
                                                    {t(
                                                        `${activity.toLowerCase()}`
                                                    )}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="exerciseDifficulty">
                                    {t("exercise difficulty")}
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
                                            placeholder={t(
                                                `${selectedDifficulty.toLowerCase()}`
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {difficulties.map((difficulty) => (
                                            <SelectItem
                                                key={difficulty}
                                                value={difficulty}
                                            >
                                                {t(
                                                    `${difficulty.toLowerCase()}`
                                                )}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {selectedActivity === "Reading Aloud" && (
                            <div className="flex flex-col flex-1 gap-2">
                                <label htmlFor="topic">{t("topic")}</label>
                                {errors.topic && (
                                    <p className="text-red-500 text-sm">
                                        {errors.topic}
                                    </p>
                                )}
                                <Textarea
                                    id="topic"
                                    placeholder={t(
                                        "placeholder.readingExerciseTopic"
                                    )}
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="w-full flex flex-row gap-2 mt-4">
                            <Button
                                className="w-full h-full rounded-full bg-primary-green hover:bg-[#045B47] font-semibold text-xl py-2 md:py-4"
                                onClick={handleAiBtnSubmit}
                                disabled={loading}
                            >
                                {loading ? t("loading.generating") : t("add")}
                            </Button>
                            <Button
                                onClick={props.handleClosePopup}
                                variant="outline"
                                className="w-full h-full rounded-full bg-transparent border-primary-green text-primary-green hover:bg-primary-green hover:text-white font-semibold py-2 md:py-4"
                            >
                                {t("button.cancel")}
                            </Button>
                        </div>
                    </form>
                }
            />
        </div>
    );
}
