import db from "@/db";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { validateAdminOrStaff } from "@/lib/validation";

export async function POST(req: Request) {
    const session = await getServerSession(authConfig);

    if (!validateAdminOrStaff(session)) {
        return new Response(
            JSON.stringify({
                error: "Unauthorized: insufficient permissions",
            }),
            { status: 401 }
        );
    }

    const formData = await req.formData();
}
