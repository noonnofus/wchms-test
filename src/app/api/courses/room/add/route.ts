import { addRoom } from "@/db/queries/rooms";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, medium, url, capacity, status, description, note } = body;

        if (!name || !medium || !url || !status) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        await addRoom(name, medium, url, capacity, status, description, note);

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
