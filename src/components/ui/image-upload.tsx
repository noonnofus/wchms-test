import React, { useCallback, useState } from 'react';
import { Input } from "../ui/input";
import Image from 'next/image';

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  existingImageUrl?: string;
}

export default function ImageUpload({ onFileSelect, existingImageUrl }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(existingImageUrl || '');
  const [error, setError] = useState<string>('');

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        className={`
          relative flex flex-col items-center justify-center
          bg-[#D9D9D9] h-[148px] w-full rounded-lg
          cursor-pointer transition-colors duration-200
          ${dragActive ? 'bg-gray-300 border-2 border-primary-green' : ''}
          hover:bg-gray-300
        `}
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={previewUrl}
              alt="Course preview"
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
            <p className="mt-2 text-gray-600">
              {dragActive ? 'Drop image here' : 'Click or drag to add a photo'}
            </p>
          </>
        )}
      </div>
      <Input
        type="file"
        id="courseImage"
        name="courseImage"
        className="hidden"
        accept="image/*"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
