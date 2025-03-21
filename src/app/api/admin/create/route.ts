import { authConfig } from "@/auth";
import { addAdmin, existAdmin } from "@/db/queries/admins";
import { validateAdmin } from "@/lib/validation";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        //Only admins can add new admins/staff
        if (!validateAdmin(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
        const body = await req.json();
        const {
            firstName,
            lastName,
            email,
            gender,
            dateOfBirth,
            password,
            role,
        } = body;

        if (!firstName || !lastName || !email || !gender || !dateOfBirth) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        const formattedDate = new Date(dateOfBirth);
        if (isNaN(formattedDate.getTime())) {
            return new Response(
                JSON.stringify({ message: "Invalid date format" }),
                { status: 400 }
            );
        }

        const existingUser = await existAdmin(email);

        if (existingUser) {
            return new Response(
                JSON.stringify({
                    message: "Admin/Staff with the email is already exists.",
                }),
                { status: 409 }
            );
        }

        await addAdmin(
            firstName,
            lastName,
            email,
            gender,
            dateOfBirth,
            password,
            role
        );

        return new Response(
            JSON.stringify({ message: "Admin sucessfully added" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error adding admin", error);
        return new Response(JSON.stringify({ error: "Error adding admin" }), {
            status: 500,
        });
    }
}
