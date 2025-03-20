"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { getLanguageFromCookie } from "@/lib/lang";
export function LanguageDropdown() {
    const [selectedLanguage, setSelectedLanguage] = React.useState("English");
    const languages = [
        { language: "English", locale: "en_US" },
        { language: "Japanese", locale: "ja_JP" },
    ];
    React.useEffect(() => {
        const fetchLanguage = async () => {
            const lang = await getLanguageFromCookie();
            setSelectedLanguage(lang);
        };

        fetchLanguage();
    }, [selectedLanguage]);

    const handleLanguage = async (value: string) => {
        setSelectedLanguage(value);

        const response = await fetch("/api/participants/language", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language: value }),
        });
        if (response.ok) {
            window.location.reload();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="font-semibold text-[#5D5D5D]"
                >
                    {selectedLanguage}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={selectedLanguage}
                    onValueChange={handleLanguage}
                >
                    {languages.map((lang) => (
                        <DropdownMenuRadioItem
                            key={lang.language}
                            value={lang.language}
                        >
                            {lang.language}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
