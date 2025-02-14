"use server";
import db from "@/db";
import { rooms as roomsTable, RoomStatus } from "@/db/schema/room";
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
