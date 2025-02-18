import { getAllParticipants } from "@/db/queries/participants";

export async function GET() {
    try {
        const participantsFirstNames = await getAllParticipants();
        return new Response(JSON.stringify(participantsFirstNames), {
            status: 200,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Error fetching participants" }),
            { status: 500 }
        );
    }
}
