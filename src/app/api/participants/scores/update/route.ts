import db from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { validateAdminOrStaff } from "@/lib/validation";
import { authConfig } from "@/auth";
import { Scores } from "@/db/schema/score";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        //Only admins and staff can edit courses
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
        const body = await req.json();

        if (!body.sessionId || !body.time || !body.instructorId) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }
        try {
            const score = await db
                .select()
                .from(Scores)
                .where(eq(Scores.id, body.id));

            if (!score) {
                return new Response(
                    JSON.stringify({ error: "Invalid Score Id" }),
                    { status: 400 }
                );
            }

            const updatedScore = await db
                .update(Scores)
                .set({
                    sessionId: body.sessionId,
                    time: body.time,
                    instructorId: body.instructorId,
                })
                .where(eq(Scores.id, body.id));

            return new Response(JSON.stringify({ score: updatedScore }), {
                status: 200,
            });
        } catch (error) {
            console.error("Error processing request:", error);
            return new Response(
                JSON.stringify({ error: "Internal Server Error" }),
                { status: 500 }
            );
        }
    } catch (error) {
        throw new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
