import { NextResponse } from "next/server";
import db from "@/db";
import { uploadMedia } from "@/db/schema/mediaUpload";
import sharp from "sharp";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        if (!file.type.startsWith('image/')) {
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
        let fileBuffer = await file.arrayBuffer();
        const maxBinarySize = 255;

        const resizedBuffer = await sharp(Buffer.from(fileBuffer))
        .resize(1000)
        .jpeg({ quality: 60 })
        .toBuffer();

        if (resizedBuffer.length > maxBinarySize) {
            return NextResponse.json(
                { error: "File too large after compression" },
                { status: 400 }
            );
        }

        // Save file and create
        const [mediaRecord] = await db.insert(uploadMedia).values({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileData: resizedBuffer.toString('base64'),
            mediaOrigin: 'course',
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
