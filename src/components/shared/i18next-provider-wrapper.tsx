"use client";
import i18n from "@/lib/i18n";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

export default function I18NextProviderWrapper({
    language,
    children,
}: {
    language: string;
    children: React.ReactNode;
}) {
    useEffect(() => {
        if (language && i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [language]);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
