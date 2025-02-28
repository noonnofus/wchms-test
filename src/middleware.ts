import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = new URL(req.url);

    if (!token && (pathname === "/" || pathname === "/admin")) {
        return NextResponse.next();
    }

    if (!token) {
        if (pathname.startsWith("/admin/")) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }

        return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/admin/")) {
        const userRole = token.role;

        if (userRole !== "Admin" && userRole !== "Staff") {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    return NextResponse.next();
}

// Protected routes
export const config = {
    matcher: ["/admin/:path*", "/landing", "/courses"],
};
