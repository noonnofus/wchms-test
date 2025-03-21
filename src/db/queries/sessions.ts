"use server";
import db from "@/db";
import { validateParticipant } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { CourseParticipant, Courses } from "../schema/course";
import { eq, desc, and, gt, asc } from "drizzle-orm";
import { Sessions } from "../schema/session";
import { authConfig } from "@/auth";

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

export async function getSessionsByStaffId(staffId: number) {
    try {
        const sessions = await db
            .select()
            .from(Sessions)
            .where(eq(Sessions.instructorId, staffId));
        return sessions;
    } catch (error) {
        console.error("Error fetching sessions:", error);
        throw new Error("Error fetching sessions");
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
            .where(eq(Sessions.courseId, courseId))
            .orderBy(desc(Sessions.endTime));
        return sessions;
    } catch (error) {
        console.error("Error fetching sessions:", error);
        throw new Error("Error fetching sessions");
    }
}

export async function getAllSessionPreviewsByCourseId(courseId: number) {
    try {
        const sessions = await db
            .select({
                id: Sessions.id,
                date: Sessions.date,
                startTime: Sessions.startTime,
                endTime: Sessions.endTime,
            })
            .from(Sessions)
            .where(eq(Sessions.courseId, courseId))
            .orderBy(desc(Sessions.endTime));
        return sessions;
    } catch (error) {
        console.error("Error fetching sessions:", error);
        throw new Error("Error fetching sessions");
    }
}

export async function getFutureSessions(courseId: number) {
    const currentDate = new Date();
    try {
        const sessions = await db
            .select()
            .from(Sessions)
            .where(
                and(
                    eq(Sessions.courseId, courseId),
                    gt(Sessions.endTime, currentDate)
                )
            )
            .orderBy(desc(Sessions.endTime));
        return sessions;
    } catch (error) {
        console.error("Error fetching future sessions: ", error);
        throw new Error("Error fetching future sessions");
    }
}

export async function getNextSessionDate() {
    const session = await getServerSession(authConfig);
    const userId = session?.user.id;

    if (!validateParticipant(session)) {
        return null;
    }

    try {
        const nowDate = new Date();
        const nextSession = await db
            .select({
                id: Sessions.id,
                courseId: Sessions.courseId,
                instructorId: Sessions.instructorId,
                date: Sessions.date,
                startTime: Sessions.startTime,
                endTime: Sessions.endTime,
                status: Sessions.status,
                courseTitle: Courses.title,
            })
            .from(Sessions)
            .innerJoin(Courses, eq(Sessions.courseId, Courses.id))
            .innerJoin(
                CourseParticipant,
                eq(Courses.id, CourseParticipant.courseId)
            )
            .where(
                and(
                    eq(CourseParticipant.userId, Number(userId)),
                    eq(Sessions.status, "Available"),
                    gt(Sessions.endTime, nowDate)
                )
            )
            .orderBy(asc(Sessions.date))
            .limit(1)
            .then((res) => res[0] || null);
        if (nextSession) {
            return {
                ...nextSession,
                date: nextSession.date.toISOString(),
                startTime: nextSession.startTime.toISOString(),
                endTime: nextSession.endTime.toISOString(),
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching next session:", error);
        throw new Error("Error fetching next session");
    }
}
