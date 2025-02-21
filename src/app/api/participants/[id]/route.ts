import { NextRequest, NextResponse } from "next/server";
import { getParticipantById } from "@/db/queries/participants";

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params;
        const aParticipants = await getParticipantById(id);

        if (aParticipants.length === 0) {
            throw new Error("No participant found");
        }

        return NextResponse.json(aParticipants[0], {
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching participant: ", error);
        return NextResponse.json(
            { message: "Error fetching participants" },
            { status: 500 }
        );
    }
}
