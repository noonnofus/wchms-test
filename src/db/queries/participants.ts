import db from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function getAllParticipantsFirstNames() {
    try {
        const participants = await db
            .select()
            .from(users)
            .where(eq(users.role, "participant"));
        console.log(participants);
        return participants;
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
            .from(users)
            .where(eq(users.email, email));

        if (existingUser.length === 0) {
            await db.insert(users).values({
                firstName,
                lastName,
                email,
                gender,
                dateOfBirth,
                role: "participant",
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
