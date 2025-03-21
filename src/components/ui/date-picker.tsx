"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";

export function DatePicker({
    selected,
    onChange,
}: {
    selected: Date | null;
    onChange: (date: Date | undefined) => void;
}) {
    const { t } = useTranslation();
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal text-base md:text-xl",
                        !selected && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {selected ? (
                        format(selected, "PPP")
                    ) : (
                        <span>{t("placeholder.pickDate")}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selected ?? undefined}
                    onSelect={onChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
