import db from "@/db";
import { eq } from "drizzle-orm";
import { users } from "../schema/users";

export async function getAllAdmins() {
    try {
        const allAdmins = await db.select().from(users);
        return allAdmins;
    } catch (error) {
        console.error("Error fetching admins", error);
        return [];
    }
}

export async function getAdminById(id: string) {
    const admin = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(id)));

    return admin;
}

export async function addAdmin(
    firstName: string,
    lastName: string,
    email: string,
    gender: "Male" | "Female" | "Other",
    dateOfBirth: Date,
    password: string,
    role: "Admin" | "Staff"
) {
    try {
        const existingAdmin = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (existingAdmin.length === 0) {
            await db.insert(users).values({
                firstName,
                lastName,
                email,
                gender,
                dateOfBirth,
                password,
                role,
            });
            console.log("Admin added");
            return { message: "Admin added successfully" };
        } else {
            console.log("Admin already exists");
            return { error: "Admin with this email already exists" };
        }
    } catch (error) {
        console.error("Error adding Admin", error);
        return { error: "Failed to add Admin" };
    }
}
