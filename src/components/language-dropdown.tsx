"use client";

import * as React from "react";
import { cookies } from 'next/headers'
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

export function LanguageDropdown() {
  // const [position, setPosition] = React.useState("bottom");
  const [selectedLanguage, setSelectedLanguage] = React.useState("English");
  const languages = ["English", "Japanese"];

  const handleLanguage = (value: string) => {
    setSelectedLanguage(value);

    fetch("/api/participants/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: value })
    });
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-semibold text-[#5D5D5D]">
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
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language} value={language}>
              {language}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
