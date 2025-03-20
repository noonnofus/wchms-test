import { authConfig } from "@/auth";
import { getAllRooms } from "@/db/queries/rooms";
import { validateAdminOrStaff } from "@/lib/validation";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession(authConfig);

        //Only admin or staff can get a list of all admin/staff
        if (!validateAdminOrStaff(session)) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: insufficient permissions",
                }),
                { status: 401 }
            );
        }
        const admins = await getAllRooms();
        return new Response(JSON.stringify(admins), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Error fetching rooms" }),
            { status: 500 }
        );
    }
}
