import db from "@/db";
import { eq } from "drizzle-orm";
import { users } from "../schema/users";
import { hashPassword } from "@/lib/hashing";

export async function getAllAdmins() {
    try {
        const allAdmins = await db
            .select({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                dateOfBirth: users.dateOfBirth,
                gender: users.gender,
                role: users.role,
            })
            .from(users);
        return allAdmins;
    } catch (error) {
        console.error("Error fetching admins", error);
        return [];
    }
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
            const hashedPass = await hashPassword(password);
            await db.insert(users).values({
                firstName,
                lastName,
                email,
                gender,
                dateOfBirth,
                password: hashedPass,
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
