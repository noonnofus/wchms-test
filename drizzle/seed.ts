import db from "../src/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

async function SeedParticipants() {
    const participants = [
        {
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            gender: "female",
            dateOfBirth: "1968-08-22",
        },
        {
            firstName: "Bob",
            lastName: "Smith",
            email: "bob@example.com",
            gender: "male",
            dateOfBirth: "1945-07-01",
        },
        {
            firstName: "Charlie",
            lastName: "Doe",
            email: "charlie@example.com",
            gender: "other",
            dateOfBirth: "1950-03-11",
        },
    ];

    const insertParticipants = participants.map(async (participant) => {
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, participant.email));

        if (existingUser.length === 0) {
            await db.insert(users).values({
                firstName: participant.firstName,
                lastName: participant.lastName,
                email: participant.email,
                gender: participant.gender as "male" | "female" | "other",
                dateOfBirth: new Date(participant.dateOfBirth),
                role: "participant",
            });
            console.log("Participant inserted");
        } else {
            console.log("Participant already exists");
        }

        await Promise.all(insertParticipants);
        console.log("Participants seeded");
    });
}

SeedParticipants().catch((error) => {
    console.error("Seed participants failed", error);
});
