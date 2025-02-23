import { NextRequest, NextResponse } from "next/server";
import { getAdminById } from "@/db/queries/admins";

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params;
        const admin = await getAdminById(id);

        if (admin.length === 0) {
            throw new Error("No admin found");
        }

        return NextResponse.json(admin[0], {
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching admin: ", error);
        return NextResponse.json(
            { message: "Error fetching admin" },
            { status: 500 }
        );
    }
}
