import db from "@/db";
import { eq } from "drizzle-orm";
import { participants } from "../schema/participants";

export async function getAllParticipants() {
    try {
        const allParticipants = await db.select().from(participants);
        return allParticipants;
    } catch (error) {
        console.error("Error fetching participants", error);
        return [];
    }
}

export async function addParticipant(
    firstName: string,
    lastName: string,
    email: string,
    gender: "male" | "female" | "other",
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
