import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSignedUrlFromFileKey, uploadToS3 } from "@/lib/s3";
import { uploadMedia } from "@/db/schema/mediaUpload";
import db from "@/db";
import { validateAdminOrStaff } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as Blob;
        if (!file) {
            return new Response(
                JSON.stringify({
                    error: "Missing File",
                }),
                { status: 400 }
            );
        }
        const session = await getServerSession(authConfig);

        //Only admins and staff can create courses
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }

        const { success, fileName } = await uploadToS3(file);
        if (!success) {
            throw new Error("Failed to upload to S3.");
        }
        const readableName = `document_${Date.now()}.pdf`;
        let uploadId: undefined | number = undefined;
        let url: undefined | string;
        if (fileName) {
            uploadId = await db
                .insert(uploadMedia)
                .values({
                    fileName: readableName,
                    fileType: file.type,
                    fileSize: file.size,
                    fileKey: fileName,
                    mediaOrigin: "course_materials",
                    ownerId: parseInt(session!.user.id),
                })
                .$returningId()
                .then((res) => res[0].id);
            if (typeof uploadId === "undefined") {
                throw new Error("Failed to create media entry");
            }
            url = await getSignedUrlFromFileKey(fileName, true, readableName);
        }

        return NextResponse.json({
            success: true,
            uploadId,
            url,
        });
    } catch (error) {
        console.error("Error generating PDF:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
