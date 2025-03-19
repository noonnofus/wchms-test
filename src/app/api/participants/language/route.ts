import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const cookieStore = await cookies();
        cookieStore.set({
            name: "language",
            value: body.language,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30,
            secure: true,
            path: "/",
        });

        return new Response(
            JSON.stringify({ message: "Language successfully stored" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error setting language option", error);
        return new Response(
            JSON.stringify({ error: "Error setting language option" }),
            { status: 500 }
        );
    }
}
