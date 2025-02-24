import db from "@/db";
import { Courses } from "@/db/schema/course";
import { Sessions } from "@/db/schema/session";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

// TODO: secure route for admins only
export async function PUT(req: Request) {
    try {
        const body = await req.json();

        if (
            !body.sessionId ||
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

        const sessionId = Number(body.sessionId);
        if (isNaN(sessionId)) {
            return new Response(
                JSON.stringify({ error: "Invalid session ID" }),
                { status: 400 }
            );
        }

        const validStatuses = ["Draft", "Available", "Completed", "Archived"];
        if (!validStatuses.includes(body.status)) {
            return new Response(
                JSON.stringify({ error: "Invalid session status" }),
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
                JSON.stringify({ error: "Invalid Course ID" }),
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
                JSON.stringify({ error: "Invalid Instructor ID" }),
                { status: 400 }
            );
        }

        const session = await db
            .select()
            .from(Sessions)
            .where(eq(Sessions.id, sessionId))
            .then((res) => res[0]);

        if (!session) {
            return new Response(
                JSON.stringify({ error: "Session not found" }),
                { status: 404 }
            );
        }

        const sessionDate = new Date(body.date);
        if (isNaN(sessionDate.getTime())) {
            return new Response(
                JSON.stringify({ error: "Invalid date format" }),
                { status: 400 }
            );
        }

        const today = new Date();
        if (sessionDate < today) {
            return new Response(
                JSON.stringify({
                    error: "Cannot update session to a past date",
                }),
                { status: 400 }
            );
        }

        console.log(body);
        await db
            .update(Sessions)
            .set({
                courseId: body.courseId,
                instructorId: body.instructorId,
                date: new Date(body.date),
                startTime: new Date(body.startTime),
                endTime: new Date(body.endTime),
                status: body.status,
            })
            .where(eq(Sessions.id, body.sessionId));

        const updatedSession = await db
            .select()
            .from(Sessions)
            .where(eq(Sessions.id, sessionId));

        return new Response(JSON.stringify({ session: updatedSession }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
