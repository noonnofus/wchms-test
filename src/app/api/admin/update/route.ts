import db from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/users";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdmin } from "@/lib/validation";
import { hashPassword } from "@/lib/hashing";

export async function PUT(req: Request) {
    try {
        const {
            id,
            firstName,
            lastName,
            email,
            gender,
            dateOfBirth,
            password,
            role,
        } = await req.json();

        if (
            !id ||
            !firstName ||
            !lastName ||
            !email ||
            !gender ||
            !dateOfBirth ||
            !password ||
            !role
        ) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }
        const session = await getServerSession(authConfig);
        const isAdmin = validateAdmin(session);
        //Only admins can update users, or users themselves
        if (!isAdmin && session?.user.id !== id.toString()) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }

        const formattedDate = new Date(dateOfBirth);
        if (isNaN(formattedDate.getTime())) {
            return new Response(
                JSON.stringify({ message: "Invalid date format" }),
                { status: 400 }
            );
        }

        const participant = await db
            .select()
            .from(users)
            .where(eq(users.id, id));

        if (!participant || participant.length === 0) {
            return new Response(
                JSON.stringify({ error: "Staff/Admin not found" }),
                { status: 404 }
            );
        }

        const hashedPassword = await hashPassword(password);

        await db
            .update(users)
            .set({
                firstName,
                lastName,
                email,
                gender,
                dateOfBirth: formattedDate,
                role: role,
                password: hashedPassword,
            })
            .where(eq(users.id, id));

        return new Response(
            JSON.stringify({ message: "Staff/Admin updated successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
