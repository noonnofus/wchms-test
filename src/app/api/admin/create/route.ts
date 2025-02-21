import { addAdmin } from "@/db/queries/admins";

export async function POST(req: Request) {
    try {
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

        const result = await addAdmin(
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
