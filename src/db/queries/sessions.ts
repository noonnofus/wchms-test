"use server";
import db from "@/db";
import { eq } from "drizzle-orm";
import { Sessions } from "../schema/session";

export async function addSession(
    courseId: number,
    instructorId: number | null,
    date: string,
    startTime: string,
    endTime: string | null,
    roomId: number | null,
    status: "Draft" | "Available" | "Completed" | "Archived"
) {
    try {
        const validStatuses = ["Draft", "Available", "Completed", "Archived"];
        if (!validStatuses.includes(status)) {
            throw new Error("Status dosnt exist");
        }

        const [session] = await db.insert(Sessions).values({
            courseId,
            instructorId,
            date: new Date(date),
            startTime: new Date(startTime),
            endTime: endTime ? new Date(endTime) : new Date(startTime),
            status,
        });

        return session;
    } catch (error) {
        console.error("Error creating session:", error);
        throw new Error("Error creating session");
    }
}

export async function getSessionById(sessionId: number) {
    try {
        const session = await db
            .select()
            .from(Sessions)
            .where(eq(Sessions.id, sessionId))
            .then((res) => res[0] || null);
        return session;
    } catch (error) {
        console.error("Error fetching session:", error);
        throw new Error("Error fetching session");
    }
}

export async function getAllSessionsByCourseId(courseId: number) {
    try {
        const sessions = await db
            .select()
            .from(Sessions)
            .where(eq(Sessions.courseId, courseId));
        return sessions;
    } catch (error) {
        console.error("Error fetching sessions:", error);
        throw new Error("Error fetching sessions");
    }
}

export async function deleteSession(sessionId: number) {
    try {
        await db.delete(Sessions).where(eq(Sessions.id, sessionId));
        return { success: true };
    } catch (error) {
        console.error("Error deleting session:", error);
        throw new Error("Failed to delete session");
    }
}
