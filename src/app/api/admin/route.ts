import { getAllAdmins } from "@/db/queries/admins";

export async function GET() {
    try {
        const admins = await getAllAdmins();
        return new Response(JSON.stringify(admins), {
            status: 200,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Error fetching admins" }),
            { status: 500 }
        );
    }
}
