// src/lib/next-auth.d.ts
import { DefaultSession } from "next-auth";
import "next-auth";

// Extending the Session and User interfaces to include 'role'
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string; // Add role here
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: string; // Add role here
    }
}
