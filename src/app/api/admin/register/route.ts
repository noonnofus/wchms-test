import db from "@/db";
import { users } from "@/db/schema/users";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function POST(req: Request) {
    const { firstName, lastName, email, password, gender, role } =
        await req.json();

    if (!firstName || !lastName || !email || !password) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "All fields (firstName, lastName, email, password) are required",
            }),
            { status: 400 }
        );
    }

    try {
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .then((rows) => rows[0]);

        if (existingUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Email is already taken",
                }),
                { status: 400 }
            );
        }

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

        return new Response(
            JSON.stringify({
                success: true,
                message: "User registered successfully",
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during registration:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Something went wrong, please try again",
            }),
            { status: 500 }
        );
    }
}
