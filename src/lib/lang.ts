"use server";
import { cookies } from "next/headers";

//This only runs on the server/server sided components
export const getLanguageFromCookie = async (): Promise<string> => {
    const cookieStore = await cookies();
    const language = cookieStore.get("i18next")?.value;
    return language || "English";
};
