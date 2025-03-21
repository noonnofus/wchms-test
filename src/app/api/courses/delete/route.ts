import { authConfig } from "@/auth";
import db from "@/db";
import { Courses } from "@/db/schema/course";
import { courseMaterials } from "@/db/schema/courseMaterials";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { notifications } from "@/db/schema/notifications";
import { deleteFromS3 } from "@/lib/s3";
import { validateAdminOrStaff } from "@/lib/validation";
import { and, eq, inArray, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

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
        await db
            .delete(notifications)
            .where(
                and(
                    inArray(notifications.type, [
                        "course_material",
                        "course_acceptance",
                        "course_invite",
                    ]),
                    sql`JSON_EXTRACT(${notifications.metadata}, '$.courseId') = ${body.courseId}`
                )
            );
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
