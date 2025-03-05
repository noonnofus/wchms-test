"use server";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const bytes = 32;
const randomImageName = () => crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const uploadToS3 = async (file: File) => {
    try {
        const fileName = randomImageName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: Buffer.from(await file.arrayBuffer()),
            ContentType: file.type,
        });

        await s3.send(command);
        return { success: true, fileName };
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error uploading file:", err.message);
        } else {
            console.error("Unknown error during file upload", err);
        }
        return { success: false };
    }
};

export const getSignedUrlFromFileKey = async (fileKey: string) => {
    console.log(process.env.AWS_BUCKET_REGION);
    const getObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); //valid for an hour
    return url;
};
