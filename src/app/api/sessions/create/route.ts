import { authConfig } from "@/auth";
import db from "@/db";
import { addSession } from "@/db/queries/sessions";
import { Courses } from "@/db/schema/course";
import { users } from "@/db/schema/users";
import { validateAdminOrStaff } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        //Only admins and staff can create course sessions
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
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

        const today = new Date();
        const startDate = new Date(body.date);

        const startDateWithoutTime = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );
        const todayWithoutTime = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        if (startDateWithoutTime < todayWithoutTime) {
            return new Response(
                JSON.stringify({
                    error: "Cannot create a session in the past",
                }),
                { status: 400 }
            );
        }

        if (isNaN(startDate.getTime()) || isNaN(today.getTime())) {
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
            return new Response(JSON.stringify({ error: "No Course Id" }), {
                status: 400,
            });
        }

        const instructor = await db
            .select()
            .from(users)
            .where(eq(users.id, body.instructorId))
            .then((res) => res[0]);

        if (!instructor) {
            return new Response(JSON.stringify({ error: "No Instructor Id" }), {
                status: 400,
            });
        }

        const courseSession = await addSession(
            body.courseId,
            body.instructorId,
            body.date,
            body.startTime,
            body.endTime || null,
            body.status
        );

        return new Response(
            JSON.stringify({
                message: "Session successfully created",
                courseSession,
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
