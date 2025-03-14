import db from "@/db";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { CourseParticipant } from "@/db/schema/course";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";

export async function DELETE(req: NextRequest) {
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

        const { userId, courseId } = await req.json();
        if (!userId || !courseId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await db
            .delete(CourseParticipant)
            .where(
                and(
                    eq(CourseParticipant.courseId, courseId),
                    eq(CourseParticipant.userId, userId)
                )
            );
        return new Response(
            JSON.stringify({
                message: "Participant successfully removed from course",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error removing participant:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
