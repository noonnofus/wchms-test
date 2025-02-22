"use server";
import db from "@/db";
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
