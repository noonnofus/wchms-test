import db from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function getAllParticipantsFirstNames() {
    try {
        const participants = await db.select().from(users);
        // .where(eq(users.role, "participant"));
        console.log(participants);
        return participants;
    } catch (error) {
        console.error("Error fetching participants", error);
        return [];
    }
}
