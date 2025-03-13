"use server";
import db from "@/db";
import {
    rooms,
    rooms as roomsTable,
    RoomStatus,
    RoomMedium,
} from "@/db/schema/room";
import { eq } from "drizzle-orm";

export async function getAvailableRooms() {
    "use server";
    try {
        const rooms = await db
            .select()
            .from(roomsTable)
            .where(eq(roomsTable.status, RoomStatus.available));
        return rooms;
    } catch (error) {
        console.error("Error fetching rooms", error);
        return [];
    }
}

export async function addRoom(
    name: string,
    medium: RoomMedium,
    url: string,
    capacity: string,
    status: RoomStatus,
    description: string,
    note: string
) {
    "use server";
    try {
        await db.insert(rooms).values({
            name,
            medium,
            url,
            capacity: Number(capacity),
            status,
            description,
            internalNote: note,
        });
    } catch (error) {
        console.error("Error adding room", error);
        return { error: "Failed to add room" };
    }
}

export async function getAllRooms() {
    try {
        const allRooms = await db
            .select({
                id: rooms.id,
                name: rooms.name,
                medium: rooms.medium,
                url: rooms.url,
                capacity: rooms.capacity,
                satus: rooms.status,
                description: rooms.description,
                internalNote: rooms.internalNote,
            })
            .from(rooms);
        return allRooms;
    } catch (error) {
        console.error("Error fetching admins", error);
        return [];
    }
}
