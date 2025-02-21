import db from "@/db";
import { Courses } from "@/db/schema/course";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import sharp from "sharp";

const MAX_FILE_SIZE = 65535;

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const courseId = formData.get("courseId");

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        if (!courseId) {
            return NextResponse.json(
                { error: "No course ID provided" },
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

        const [course] = await db
            .select()
            .from(Courses)
            .where(eq(Courses.id, parseInt(courseId as string, 10)))
            .limit(1);

        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        const fileBuffer = await file.arrayBuffer();
        const fileType = file.name.split(".").pop()?.toLowerCase();
        let imageFormat =
            fileType === "jpeg" || fileType === "jpg" ? "jpeg" : "png";

        let resizedBuffer = await sharp(Buffer.from(fileBuffer))
            .resize(1000)
            .toFormat(imageFormat as "jpeg" | "png", { quality: 40 })
            .toBuffer();

        let base64Data = resizedBuffer.toString("base64");

        if (base64Data.length > MAX_FILE_SIZE) {
            resizedBuffer = await sharp(Buffer.from(fileBuffer))
                .resize(800)
                .toFormat(imageFormat as "jpeg" | "png", { quality: 40 })
                .toBuffer();

            base64Data = resizedBuffer.toString("base64");

            if (base64Data.length > MAX_FILE_SIZE) {
                resizedBuffer = await sharp(Buffer.from(fileBuffer))
                    .resize(600)
                    .toFormat(imageFormat as "jpeg" | "png", { quality: 40 })
                    .toBuffer();

                base64Data = resizedBuffer.toString("base64");
            }
        }

        if (course.uploadId) {
            await db
                .update(uploadMedia)
                .set({
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    fileData: base64Data,
                })
                .where(eq(uploadMedia.id, course.uploadId));

            return NextResponse.json({ id: course.uploadId });
        } else {
            const [mediaRecord] = await db.insert(uploadMedia).values({
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileData: base64Data,
                mediaOrigin: "course",
                originId: parseInt(courseId as string, 10),
            });

            await db
                .update(Courses)
                .set({
                    uploadId: mediaRecord.insertId,
                })
                .where(eq(Courses.id, parseInt(courseId as string, 10)));

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
