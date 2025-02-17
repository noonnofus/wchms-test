import db from "@/db";
import { uploadMedia } from "@/db/schema/mediaUpload";
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

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Invalid file type" },
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

        let resizedBuffer = await sharp(Buffer.from(fileBuffer))
            .resize(1000)
            .jpeg({ quality: 60 })
            .toBuffer();

        let base64Data = resizedBuffer.toString("base64");

        if (base64Data.length > MAX_FILE_SIZE) {
            resizedBuffer = await sharp(Buffer.from(fileBuffer))
                .resize(800)
                .jpeg({ quality: 50 })
                .toBuffer();

            base64Data = resizedBuffer.toString("base64");

            if (base64Data.length > MAX_FILE_SIZE) {
                resizedBuffer = await sharp(Buffer.from(fileBuffer))
                    .resize(600)
                    .jpeg({ quality: 40 })
                    .toBuffer();

                base64Data = resizedBuffer.toString("base64");
            }
        }

        const [mediaRecord] = await db.insert(uploadMedia).values({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileData: base64Data,
            mediaOrigin: "course",
            originId: 0,
        });

        return NextResponse.json({ id: mediaRecord.insertId });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
