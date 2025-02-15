import db from "@/db";
import { users } from "@/db/schema/users";
import bcrypt from "bcrypt";
import { eq, and } from "drizzle-orm";
import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { participants } from "./db/schema/participants";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}
export const authConfig: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                firstName: {
                    label: "First Name",
                    type: "text",
                    placeholder: "Enter your first name",
                },
                lastName: {
                    label: "Last Name",
                    type: "text",
                    placeholder: "Enter your last name",
                },
                loginType: {
                    label: "Login Type",
                    type: "text",
                    placeholder: "admin or participant",
                },
            },
            async authorize(credentials) {
                if (credentials?.loginType.toLowerCase() === "admin") {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Enter your email and password");
                    }

                    const user = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, credentials.email))
                        .limit(1)
                        .then((rows) => rows[0]);

                    if (!user || !user.password) {
                        throw new Error("Invalid email or password");
                    }

                    const validPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (!validPassword) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        role: user.role,
                    };
                } else if (
                    credentials?.loginType.toLowerCase() === "participant"
                ) {
                    if (!credentials?.firstName || !credentials?.lastName) {
                        throw new Error("Enter your first name, and last name");
                    }

                    const user = await db
                        .select()
                        .from(participants)
                        .where(
                            and(
                                eq(
                                    participants.firstName,
                                    credentials.firstName
                                ),
                                eq(participants.lastName, credentials.lastName)
                            )
                        )
                        .limit(1)
                        .then((rows) => rows[0]);
                    if (!user) {
                        throw new Error("Invalid user");
                    }

                    return {
                        id: user.id.toString(),
                        firstName: user.firstName,
                        lastName: user.lastName,
                    };
                }
                throw new Error("Invalid signin method");
            },
        }),
    ],

    // callbacks: {
    //     async session({ session, user }) {
    //         session.user.id = user.id;
    //         return session;
    //     },
    // authorized({ auth, request: { nextUrl } }: { auth: any; request: { nextUrl: URL } }) {
    //     const isLoggedIn = !!auth?.user;
    //     const paths = ["/staff", "/staff/dashboard", "/admin/dashboard"];

    //     const isProtected = paths.some((path) =>
    //         nextUrl.pathname.startsWith(path)
    //     );

    //     if (isProtected && !isLoggedIn) {
    //         const redirectUrl = new URL("/api/auth/signin", nextUrl.origin);
    //         redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
    //         return Response.redirect(redirectUrl);
    //     }

    //     return true;
    // },
    //},
    callbacks: {
        async session({ session, user }) {
            if (user) {
                session.user.id = user.id;
            }
            return session;
        },
    },

    pages: {
        signIn: undefined,
        signOut: "/logout",
    },

    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
};

export const { handlers, auth, signOut } = NextAuth(authConfig);
