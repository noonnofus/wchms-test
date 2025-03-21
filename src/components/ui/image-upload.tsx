import { Input } from "@/components/ui/input";
import { use } from "i18next";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ImageUploadProps {
    fileUrl: string | null;
    onImageSelect?: (file: File | null) => void;
    error?: string;
}

export default function ImageUpload({
    fileUrl,
    onImageSelect,
    error: externalError,
}: ImageUploadProps) {
    const { t } = useTranslation();
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [internalError, setInternalError] = useState<string>("");
    useEffect(() => {
        setPreviewUrl(fileUrl || null);
    }, [fileUrl]);
    const handleFile = useCallback(
        (file: File | null) => {
            if (!file) {
                setPreviewUrl(null);
                onImageSelect?.(null);
                return;
            }

            if (!file.type.startsWith("image/")) {
                setInternalError("Please upload an image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setInternalError("Image must be less than 5MB");
                return;
            }

            setInternalError("");
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(newPreviewUrl);
            onImageSelect?.(file);

            return () => URL.revokeObjectURL(newPreviewUrl);
        },
        [onImageSelect]
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
                className={`
          relative flex flex-col items-center justify-center
          bg-gray-100 h-48 w-full rounded-lg
          cursor-pointer transition-colors duration-200
          ${dragActive ? "bg-gray-200 border-2 border-primary" : ""}
          hover:bg-gray-200
        `}
            >
                {previewUrl ? (
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
                    <>
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
                                : t("click or drag to add a photo")}
                        </p>
                    </>
                )}
            </div>
            <Input
                type="file"
                id="courseImage"
                name="courseImage"
                className="hidden"
                accept="image/jpeg, image/png"
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
