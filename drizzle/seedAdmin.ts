import { users } from "@/db/schema/users";
import db from "../src/db";
import { hashPassword } from "@/lib/hashing";

const seedAdmin = async () => {
    try {
        const adminPassword = await hashPassword("admin123");
        const staffPassword = await hashPassword("staff123");

        await db.insert(users).values({
            firstName: "Admin",
            lastName: "User",
            email: "admin@wchms.com",
            password: adminPassword,
            dateOfBirth: new Date("1980-01-01"),
            gender: "Male",
            role: "Admin",
        });

        await db.insert(users).values({
            firstName: "Staff",
            lastName: "User",
            email: "staff@wchms.com",
            password: staffPassword,
            dateOfBirth: new Date("1990-01-01"),
            gender: "Female",
            role: "Staff",
        });

        console.log("Database seeded with admin and staff users.");
    } catch (error) {
        console.error("Error seeding database: ", error);
    }
};

seedAdmin();
