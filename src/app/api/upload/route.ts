import { authConfig } from "@/auth";
import db from "@/db";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { uploadToS3 } from "@/lib/s3";
import { validateAdminOrStaff } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import sharp from "sharp";

const MAX_FILE_SIZE = 65535;

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }
        const session = await getServerSession(authConfig);

        //Only admin or staff can upload
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }

        if (
            !file.type.startsWith("image/") ||
            (file.type !== "image/jpeg" && file.type !== "image/png")
        ) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG and PNG are allowed" },
                { status: 400 }
            );
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File size too large" },
                { status: 400 }
            );
        }

        const fileBuffer = await file.arrayBuffer();
        const fileType = file.name.split(".").pop()?.toLowerCase();

        let imageFormat =
            fileType === "jpeg" || fileType === "jpg"
                ? ("jpeg" as const)
                : ("png" as const);

        let resizedBuffer = await sharp(Buffer.from(fileBuffer))
            .resize(1000)
            [imageFormat]({ quality: 60 })
            .toBuffer();

        let base64Data = resizedBuffer.toString("base64");

        if (base64Data.length > MAX_FILE_SIZE) {
            resizedBuffer = await sharp(Buffer.from(fileBuffer))
                .resize(800)
                [imageFormat]({ quality: 50 })
                .toBuffer();

            base64Data = resizedBuffer.toString("base64");

            if (base64Data.length > MAX_FILE_SIZE) {
                resizedBuffer = await sharp(Buffer.from(fileBuffer))
                    .resize(600)
                    [imageFormat]({ quality: 40 })
                    .toBuffer();

                base64Data = resizedBuffer.toString("base64");
            }
        }

        const { success, fileName } = await uploadToS3(file);
        if (!success) {
            throw new Error("Failed to upload to S3.");
        }

        if (fileName) {
            const [mediaRecord] = await db.insert(uploadMedia).values({
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileKey: fileName,
                mediaOrigin: "course",
                ownerId: parseInt(session!.user.id), //session is checked in admin/staff validation
            });

            return NextResponse.json({ id: mediaRecord.insertId });
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
