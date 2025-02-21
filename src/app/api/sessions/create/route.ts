import db from "@/db";
import { eq } from "drizzle-orm";
import { Courses } from "@/db/schema/course";
import { users } from "@/db/schema/users";
import { addSession } from "@/db/queries/sessions";

// TODO: secure route for admins only
export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (
            !body.courseId ||
            !body.instructorId ||
            !body.date ||
            !body.startTime ||
            !body.status
        ) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

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
        
        const course = await db
            .select()
            .from(Courses)
            .where(eq(Courses.id, body.courseId))
            .then((res) => res[0]);

        if (!course) {
            return new Response(
                JSON.stringify({ error: "No Course Id" }),
                { status: 400 }
            );
        }

        const instructor = await db
            .select()
            .from(users)
            .where(eq(users.id, body.instructorId))
            .then((res) => res[0]);

        if (!instructor) {
            return new Response(
                JSON.stringify({ error: "No Instructor Id" }),
                { status: 400 }
            );
        }

        const session = await addSession(
            body.courseId,
            body.instructorId,
            body.date,
            body.startTime,
            body.endTime || null,
            body.roomId || null,
            body.status
        );

        return new Response(
            JSON.stringify({
                message: "Session successfully created",
                session,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
