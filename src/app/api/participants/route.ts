import { getAllParticipantsFirstNames } from "@/db/queries/participants";

export async function GET() {
    try {
        const participants = await getAllParticipantsFirstNames();
        return new Response(JSON.stringify(participants), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Error fetching participants" }),
            { status: 500 }
        );
    }
}
