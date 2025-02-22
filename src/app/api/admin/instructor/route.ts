import db from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const instructors = await db
            .select({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                role: users.role,
            })
            .from(users)
            .where(eq(users.role, "staff"));

        return new Response(JSON.stringify(instructors), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching instructors:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Something went wrong" }),
            { status: 500 }
        );
    }
}
