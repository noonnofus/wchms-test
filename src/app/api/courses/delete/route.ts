import { Courses } from "@/db/schema/course";
import { eq } from "drizzle-orm";
import db from "@/db";

export async function DELETE(req: Request) {
    try {
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
            .where(eq(Courses.id, body.courseId));
        if (!course || course.length === 0) {
            return new Response(JSON.stringify({ error: "Course not found" }), {
                status: 404,
            });
        }

        await db.delete(Courses).where(eq(Courses.id, body.courseId));

        return new Response(
            JSON.stringify({ message: "Course deleted successfully" }),
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
