"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, CaptionProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    function CustomCaption({ displayMonth }: CaptionProps) {
        const fromYear = 2000;
        const toYear = new Date().getFullYear() + 10;
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        return (
            <div className="flex items-center justify-center space-x-2">
                <button
                    type="button"
                    onClick={() =>
                        setCurrentMonth(
                            new Date(
                                displayMonth.getFullYear(),
                                displayMonth.getMonth() - 1
                            )
                        )
                    }
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-8 w-8 flex items-center justify-center rounded-md"
                    )}
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <select
                    value={displayMonth.getMonth()}
                    onChange={(e) => {
                        const newMonth = Number(e.target.value);
                        setCurrentMonth(
                            new Date(displayMonth.getFullYear(), newMonth)
                        );
                    }}
                    className="text-sm font-medium bg-white border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500"
                >
                    {months.map((month, index) => (
                        <option key={month} value={index}>
                            {month}
                        </option>
                    ))}
                </select>

                <select
                    value={displayMonth.getFullYear()}
                    onChange={(e) => {
                        const newYear = Number(e.target.value);
                        setCurrentMonth(
                            new Date(newYear, displayMonth.getMonth())
                        );
                    }}
                    className="text-sm font-medium bg-white border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500"
                >
                    {Array.from(
                        { length: toYear - fromYear + 1 },
                        (_, i) => fromYear + i
                    ).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={() =>
                        setCurrentMonth(
                            new Date(
                                displayMonth.getFullYear(),
                                displayMonth.getMonth() + 1
                            )
                        )
                    }
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-8 w-8 flex items-center justify-center rounded-md"
                    )}
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="w-[320px] h-[350px] flex flex-col justify-between p-4 border border-gray-300 rounded-lg shadow-md bg-white">
            <DayPicker
                showOutsideDays={showOutsideDays}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className={cn(
                    "w-full h-full flex flex-col justify-between",
                    className
                )}
                classNames={{
                    months: "flex flex-col items-center justify-center",
                    month: "space-y-2",
                    caption: "flex justify-center pt-1 items-center",
                    caption_label: "text-sm font-medium",
                    nav: "flex items-center space-x-2",
                    table: "w-full border-collapse",
                    head_row: "grid grid-cols-7 text-center w-full",
                    head_cell:
                        "text-muted-foreground font-semibold text-sm py-2",
                    row: "grid grid-cols-7",
                    cell: "relative p-0 text-center text-sm",
                    day: cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-10 w-10 p-0 font-normal aria-selected:opacity-100"
                    ),
                    day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    ...classNames,
                }}
                components={{
                    Caption: CustomCaption,
                    IconLeft: ({ className, ...props }) => (
                        <ChevronLeft
                            className={cn("h-4 w-4", className)}
                            {...props}
                        />
                    ),
                    IconRight: ({ className, ...props }) => (
                        <ChevronRight
                            className={cn("h-4 w-4", className)}
                            {...props}
                        />
                    ),
                }}
                {...props}
            />
        </div>
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
