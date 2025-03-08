export const VALID_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; //5MB by default
export const MAX_PDF_SIZE = 20 * 1024 * 1024;

export const validateImage = (file: File) => {
    if (!VALID_IMAGE_TYPES.has(file.type)) {
        return {
            error: "Invalid file type. Only JPEG and PNG are allowed",
        };
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return {
            error: `File size too large, must be under ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
        };
    }

    return null;
};

export const validatePDF = (file: File) => {
    if (file.type !== "application/pdf") {
        return {
            error: "Invalid file type. Only PDFs are allowed",
        };
    }
    if (file.size > MAX_PDF_SIZE) {
        return {
            error: `File size too large, must be under ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
        };
    }

    return null;
};

export const validateFile = (file: File) => {
    if (!VALID_IMAGE_TYPES.has(file.type) && file.type !== "application/pdf") {
        return { error: "Please upload a JPEG, PNG or PDF file" };
    }

    if (file.type.startsWith("image/")) {
        if (file.size > MAX_IMAGE_SIZE) {
            return {
                error: `Image must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
            };
        }
    } else {
        if (file.size > MAX_PDF_SIZE) {
            return {
                error: `PDF must be less than ${MAX_PDF_SIZE / 1024 / 1024}MB`,
            };
        }
    }
    return null;
};
