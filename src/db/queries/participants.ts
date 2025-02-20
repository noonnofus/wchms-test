import db from "@/db";
import { eq } from "drizzle-orm";
import { participants } from "../schema/participants";
import { Courses } from "../schema/course";
import { CourseParticipant } from "../schema/course";

export async function getAllParticipants() {
    try {
        const allParticipants = await db
            .select({
                participant: participants,
                course: Courses,
            })
            .from(participants)
            .leftJoin(
                CourseParticipant,
                eq(participants.id, CourseParticipant.userId)
            )
            .leftJoin(Courses, eq(CourseParticipant.courseId, Courses.id));

        return allParticipants;
    } catch (error) {
        console.error("Error fetching participants", error);
        return [];
    }
}

export async function getParticipantById(id: string) {
    const participant = await db
        .select()
        .from(participants)
        .where(eq(participants.id, Number(id)));

    return participant;
}

export async function addParticipant(
    firstName: string,
    lastName: string,
    email: string,
    gender: "Male" | "Female" | "Other",
    dateOfBirth: Date
) {
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
