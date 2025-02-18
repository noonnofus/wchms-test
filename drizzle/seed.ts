import { participants } from "@/db/schema/participants";
import { eq } from "drizzle-orm";
import db from "../src/db";

async function SeedParticipants() {
    const seedParticipants = [
        {
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            gender: "Female",
            dateOfBirth: "1968-08-22",
        },
        {
            firstName: "Bob",
            lastName: "Smith",
            email: "bob@example.com",
            gender: "Male",
            dateOfBirth: "1945-07-01",
        },
        {
            firstName: "Charlie",
            lastName: "Doe",
            email: "charlie@example.com",
            gender: "Other",
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
                gender: p.gender as "Male" | "Female" | "Other",
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

import { RoomMedium, rooms as roomsTable, RoomStatus } from "@/db/schema/room";

async function SeedRooms() {
    const rooms = [
        {
            name: "Online via Zoom",
            url: "",
            medium: "online" as RoomMedium,
            status: "available" as RoomStatus,
        },
        {
            name: "Burnaby",
            medium: "offline" as RoomMedium,
            status: "available" as RoomStatus,
        },
        {
            name: "Skype",
            medium: "online" as RoomMedium,
            status: "unavailable" as RoomStatus,
        },
    ];

    const insertRooms = rooms.map(async (room) => {
        const existingRoom = await db
            .select()
            .from(roomsTable)
            .where(eq(roomsTable.name, room.name))
            .limit(1);

        if (existingRoom.length === 0) {
            await db.insert(roomsTable).values({
                name: room.name,
                url: room.url,
                medium: room.medium,
                status: room.status,
            });
        }
    });

    await Promise.all(insertRooms).then(() => {
        console.log("Rooms inserted or checked for existence.");
    });
}

SeedRooms().catch((error) => {
    console.error("Seed Rooms failed", error);
});
