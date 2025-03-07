import db from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { CourseParticipant } from "@/db/schema/course";

export async function POST(req: NextRequest) {
    try {
        const { userId, courseId } = await req.json();

        if (!userId || !courseId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await db.insert(CourseParticipant).values({
            userId,
            courseId,
        });

        return NextResponse.json(
            { message: "Participant added successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding participant:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
