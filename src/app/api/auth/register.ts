// /pages/api/auth/register.ts
import db from "@/db";
import { users } from "@/db/schema/users";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { firstName, lastName, email, password, gender, role } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .then((rows) => rows[0]);

        if (existingUser) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        try {
            const hashedPassword = await hashPassword(password);
            const userId = uuidv4();

            await db.insert(users).values({
                id: userId,
                firstName,
                lastName,
                email,
                password: hashedPassword,
                gender,
                role,
            });

            return res
                .status(201)
                .json({ message: "User registered successfully" });
        } catch (error) {
            console.error("Error during registration:", error);
            return res
                .status(500)
                .json({ error: "Something went wrong, please try again" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
