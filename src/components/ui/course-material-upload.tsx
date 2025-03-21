import { Input } from "@/components/ui/input";
import { CourseMaterialsWithFile } from "@/db/schema/courseMaterials";
import {
    MAX_IMAGE_SIZE,
    MAX_PDF_SIZE,
    VALID_IMAGE_TYPES,
} from "@/lib/fileUploads";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface FileUploadProps {
    fileUrl: string | null;
    courseMaterial?: CourseMaterialsWithFile | null;
    onFileSelect?: (file: File | null) => void;
    error?: string;
}

export default function CourseMaterialUpload({
    fileUrl,
    courseMaterial,
    onFileSelect,
    error: externalError,
}: FileUploadProps) {
    const { t } = useTranslation();
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [internalError, setInternalError] = useState<string>("");

    useEffect(() => {
        if (fileUrl) {
            setPreviewUrl(fileUrl);
        }
        if (courseMaterial?.file) {
            setFileType(courseMaterial.file.fileType);
            setFileName(courseMaterial.file.fileName);
        }
    }, [fileUrl, courseMaterial]);

    const handleFile = useCallback(
        (file: File | null) => {
            if (!file) {
                setPreviewUrl(null);
                setFileType(null);
                onFileSelect?.(null);
                return;
            }

            if (
                !VALID_IMAGE_TYPES.has(file.type) &&
                file.type !== "application/pdf"
            ) {
                setInternalError("Please upload an image file or PDF");
                return;
            }

            if (file.type.startsWith("image/")) {
                if (file.size > MAX_IMAGE_SIZE) {
                    setInternalError(
                        `Image must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
                    );
                    return;
                }
                setFileType("image");
            } else {
                if (file.size > MAX_PDF_SIZE) {
                    setInternalError(
                        `PDF must be less than ${MAX_PDF_SIZE / 1024 / 1024}MB`
                    );
                    return;
                }
                setFileType("pdf");
            }

            setInternalError("");
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(newPreviewUrl);
            onFileSelect?.(file);

            return () => URL.revokeObjectURL(newPreviewUrl);
        },
        [onFileSelect]
    );

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            const file = e.dataTransfer.files?.[0];
            handleFile(file || null);
        },
        [handleFile]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            handleFile(file || null);
            setFileType(file?.type || null);
            setFileName(file?.name || null);
        },
        [handleFile]
    );

    const handleClick = useCallback(() => {
        const fileInput = document.getElementById("courseImage");
        fileInput?.click();
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div
                onClick={handleClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center bg-gray-100 h-48 w-full rounded-lg cursor-pointer transition-colors duration-200 ${dragActive ? "bg-gray-200 border-2 border-primary" : ""} hover:bg-gray-200`}
            >
                {previewUrl ? (
                    fileType &&
                    previewUrl &&
                    VALID_IMAGE_TYPES.has(fileType) ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={previewUrl}
                                alt="Upload preview"
                                fill
                                className="object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-200 rounded-lg" />
                        </div>
                    ) : (
                        fileType === "application/pdf" && (
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
                                    <p>{fileName || "No PDF uploaded"}</p>
                                </div>
                            </div>
                        )
                    )
                ) : (
                    <div className="flex flex-col justify-center items-center">
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
                        <p className="mt-2 text-sm text-gray-600">
                            {dragActive
                                ? t("drop image here")
                                : t("fileUploadLabel")}
                        </p>
                    </div>
                )}
            </div>
            <Input
                type="file"
                id="courseImage"
                name="courseImage"
                className="hidden"
                accept="image/jpeg, image/png, application/PDF"
                onChange={handleChange}
            />
            {(internalError || externalError) && (
                <p className="text-red-500 text-sm">
                    {internalError || externalError}
                </p>
            )}
        </div>
    );
}
