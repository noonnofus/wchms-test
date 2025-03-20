"use server";
import db from "@/db";
import { eq, sql } from "drizzle-orm";
import { CourseParticipant, Courses } from "../schema/course";
import { participants } from "../schema/participants";

export async function getAllParticipants(withCourses = false) {
    "use server";
    try {
        if (withCourses) {
            const allParticipants = await db
                .select({
                    participant: participants,
                    course: sql`GROUP_CONCAT(CONCAT(${Courses.id}, ':', ${Courses.title}) SEPARATOR ', ')`.as(
                        "courses"
                    ),
                })
                .from(participants)
                .leftJoin(
                    CourseParticipant,
                    eq(participants.id, CourseParticipant.userId)
                )
                .leftJoin(Courses, eq(CourseParticipant.courseId, Courses.id))
                .groupBy(participants.id);

            return allParticipants;
        } else {
            const allParticipants = await db.select().from(participants);
            return allParticipants;
        }
    } catch (error) {
        console.error("Error fetching participants", error);
        return [];
    }
}

export async function getParticipantById(id: number) {
    "use server";
    try {
        const result = await db
            .select()
            .from(participants)
            .where(eq(participants.id, Number(id)));

        if (result.length === 0) return null;
        return result[0];
    } catch (error) {
        console.error("Error fetching participant", error);
        return null;
    }
}

export async function existParticipant(email: string) {
    "use server";
    try {
        const existingUser = await db
            .select()
            .from(participants)
            .where(eq(participants.email, email));

        if (existingUser) {
            throw new Error(
                "The participant with the email is already exists, Please try again with another email"
            );
        }
    } catch (error) {
        return { error: error };
    }
}

export async function addParticipant(
    firstName: string,
    lastName: string,
    email: string,
    gender: "Male" | "Female" | "Other",
    dateOfBirth: Date
) {
    "use server";
    try {
        const existingUser = await db
            .select()
            .from(participants)
            .where(eq(participants.email, email));

        if (existingUser.length === 0) {
            await db.insert(participants).values({
                firstName,
                lastName,
                email,
                gender,
                dateOfBirth,
            });
            console.log("Participant added");
            return { message: "Participant added successfully" };
        } else {
            console.log("Participant already exists");
            return { error: "Participant with this email already exists" };
        }
    } catch (error) {
        console.error("Error adding participant", error);
        return { error: "Failed to add participant" };
    }
}

export async function deleteParticipant(participantId: number) {
    "use server";
    try {
        const result = await db
            .delete(participants)
            .where(eq(participants.id, participantId));
        if (!result) {
            return { error: "Participant not found or already deleted" };
        }

        console.log(`Participant with ID ${participantId} deleted`);
        return { message: "Participant deleted successfully" };
    } catch (error) {
        console.error("Error deleting participant", error);
        return { error: "Failed to delete participant" };
    }
}
