const VALID_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; //5MB by default

export const validateImage = (file: File) => {
    if (!VALID_IMAGE_TYPES.has(file.type)) {
        return {
            error: "Invalid file type. Only JPEG and PNG are allowed",
        };
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return {
            error: "File size too large, must be under 5MB",
        };
    }

    return null;
};
