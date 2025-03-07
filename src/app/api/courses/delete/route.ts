import { Courses } from "@/db/schema/course";
import { eq } from "drizzle-orm";
import db from "@/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";
import { deleteFromS3 } from "@/lib/s3";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { courseMaterials } from "@/db/schema/courseMaterials";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        //Only admins and staff can delete courses
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
        const body = await req.json();

        // Validate that courseId is provided
        if (!body.courseId) {
            return new Response(JSON.stringify({ error: "Missing courseId" }), {
                status: 400,
            });
        }

        // Validate if course exists
        const course = await db
            .select()
            .from(Courses)
            .where(eq(Courses.id, body.courseId))
            .then((res) => res[0]);
        if (!course) {
            return new Response(JSON.stringify({ error: "Course not found" }), {
                status: 404,
            });
        }
        if (course.uploadId) {
            console.log("deleting course image");
            const file = await db
                .select()
                .from(uploadMedia)
                .where(eq(uploadMedia.id, course.uploadId))
                .then((res) => res[0]);
            await deleteFromS3(file.fileKey);
        }
        const materials = await db
            .select()
            .from(courseMaterials)
            .where(eq(courseMaterials.courseId, course.id))
            .leftJoin(
                uploadMedia,
                eq(courseMaterials.uploadId, uploadMedia.id)
            );
        if (materials.length) {
            console.log("deleting materials");
            await Promise.all(
                materials.map(async (material) => {
                    if (material.upload_media?.fileKey) {
                        await deleteFromS3(material.upload_media.fileKey);
                    }
                })
            );
        }
        await db.delete(Courses).where(eq(Courses.id, body.courseId));

        return new Response(
            JSON.stringify({
                message: "Course and related materials deleted successfully",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
