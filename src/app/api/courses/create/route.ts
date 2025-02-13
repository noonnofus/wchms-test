import db from "@/db";
import { Course } from "@/db/schema/course";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (
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
        console.log(body);
        db.insert(Course).values({
            title: body.courseName,
            description: body.courseDescription,
            start: body.courseStartDate,
            end: body.courseEndDate,
            lang: body.courseLanguage,
            status: body.courseStatus,
            kind: body.courseType,
        });
        return new Response(
            JSON.stringify({ message: "Course created successfully" }),
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
