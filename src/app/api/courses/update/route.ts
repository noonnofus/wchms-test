import db from "@/db";
import { eq } from "drizzle-orm";
import { Courses } from "@/db/schema/course";
import { rooms } from "@/db/schema/room";
//TODO: secure route for admins only
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        console.log(body);
        if (
            !body.courseId ||
            !body.courseName ||
            !body.courseDescription ||
            !body.courseStartDate ||
            !body.courseEndDate
        ) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        if (
            body.courseName.length > 255 ||
            body.courseDescription.length > 255
        ) {
            return new Response(
                JSON.stringify({
                    error: "Course Name/Description character limit exceeded",
                }),
                { status: 400 }
            );
        }

        // Check for valid start and end dates
        const startDate = new Date(body.courseStartDate);
        const endDate = new Date(body.courseEndDate);
        if (endDate <= startDate) {
            return new Response(
                JSON.stringify({
                    error: "End date must be after the start date",
                }),
                { status: 400 }
            );
        }
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return new Response(
                JSON.stringify({
                    error: "Invalid date format",
                }),
                { status: 400 }
            );
        }

        // Validate Room Id
        const roomId = parseInt(body.courseRoom);
        if (!roomId || roomId === -1) {
            return new Response(
                JSON.stringify({
                    error: "Missing Room Id",
                }),
                { status: 400 }
            );
        }

        // Validate Room Exists
        const room = await db.select().from(rooms).where(eq(rooms.id, roomId));
        if (!room || room.length === 0) {
            return new Response(
                JSON.stringify({
                    error: "Invalid Room Id",
                }),
                { status: 400 }
            );
        }

        // Validate Course Exists
        const course = await db
            .select()
            .from(Courses)
            .where(eq(Courses.id, body.courseId));
        if (!course || course.length === 0) {
            return new Response(
                JSON.stringify({
                    error: "Course not found",
                }),
                { status: 404 }
            );
        }
        // TODO: Handle image upload (if required)

        // Update Course
        await db
            .update(Courses)
            .set({
                title: body.courseName,
                description: body.courseDescription,
                start: startDate,
                end: endDate,
                lang: body.courseLanguage,
                status: body.courseStatus,
                kind: body.courseType,
                roomId,
            })
            .where(eq(Courses.id, body.courseId));

        const updatedCourse = await db
            .select()
            .from(Courses)
            .where(eq(Courses.id, body.courseId));

        // Respond with the updated course id
        return new Response(JSON.stringify({ courseId: updatedCourse[0].id }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error processing the request:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
