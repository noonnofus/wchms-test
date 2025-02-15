import { addParticipant } from "@/db/queries/participants";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, gender, dateOfBirth } = body;

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

        const result = await addParticipant(
            firstName,
            lastName,
            email,
            gender,
            dateOfBirth
        );

        return new Response(
            JSON.stringify({ message: "Participant sucessfully added" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error adding participant", error);
        return new Response(
            JSON.stringify({ error: "Error adding participant" }),
            { status: 500 }
        );
    }
}
