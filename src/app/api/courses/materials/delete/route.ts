import { authConfig } from "@/auth";
import db from "@/db";
import { courseMaterials } from "@/db/schema/courseMaterials";
import { uploadMedia } from "@/db/schema/mediaUpload";
import { notifications } from "@/db/schema/notifications";
import { deleteFromS3 } from "@/lib/s3";
import { validateAdminOrStaff } from "@/lib/validation";
import { and, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        // Only admins and staff can delete course materials
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
        const body = await req.json();

        // Validate that courseMaterialId is provided
        if (!body.courseMaterialId) {
            return new Response(
                JSON.stringify({ error: "Missing courseMaterialId" }),
                {
                    status: 400,
                }
            );
        }

        // Validate if course material exists
        const courseMaterial = await db
            .select()
            .from(courseMaterials)
            .where(eq(courseMaterials.id, body.courseMaterialId))
            .leftJoin(uploadMedia, eq(courseMaterials.uploadId, uploadMedia.id))
            .then((res) => res[0]);
        if (!courseMaterial) {
            return new Response(
                JSON.stringify({ error: "Course material not found" }),
                {
                    status: 404,
                }
            );
        }
        if (courseMaterial.upload_media?.fileKey) {
            await deleteFromS3(courseMaterial.upload_media.fileKey);
        }

        await db.delete(notifications).where(
            and(
                eq(notifications.type, "course_material"),
                sql`
                    CAST(
                        JSON_UNQUOTE(
                            JSON_EXTRACT(
                                JSON_UNQUOTE(${notifications.metadata}),
                                '$.materialId'
                            )
                        ) AS UNSIGNED
                    ) = ${body.courseMaterialId}`
            )
        );

        // Delete the course material
        await db
            .delete(courseMaterials)
            .where(eq(courseMaterials.id, body.courseMaterialId));

        return new Response(
            JSON.stringify({ message: "Course material deleted successfully" }),
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
