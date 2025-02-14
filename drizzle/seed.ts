import db from "../src/db";
import { participants } from "@/db/schema/participants";
import { eq } from "drizzle-orm";

async function SeedParticipants() {
    const seedParticipants = [
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

    const insertParticipants = seedParticipants.map(async (p) => {
        const existingUser = await db
            .select()
            .from(participants)
            .where(eq(participants.email, p.email));

        if (existingUser.length === 0) {
            await db.insert(participants).values({
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email,
                gender: p.gender as "male" | "female" | "other",
                dateOfBirth: new Date(p.dateOfBirth),
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
