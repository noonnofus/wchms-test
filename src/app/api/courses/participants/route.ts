import db from "@/db";
import { participants } from "@/db/schema/participants";
import { NextResponse } from "next/server";
import { CourseParticipant } from "@/db/schema/course";
import { and, eq, isNull } from "drizzle-orm";

export async function GET(req: NextResponse) {
    try {
        const { courseId } = await req.json();
        if (!courseId) {
            return NextResponse.json(
                { error: "courseId is required" },
                { status: 400 }
            );
        }

        const availableParticipants = await db
            .select()
            .from(participants)
            .leftJoin(
                CourseParticipant,
                eq(participants.id, CourseParticipant.userId)
            )
            .where(
                and(
                    eq(CourseParticipant.courseId, courseId),
                    isNull(CourseParticipant.userId)
                )
            );

        return NextResponse.json(availableParticipants);
    } catch (error) {
        console.error("Error fetching participants:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
