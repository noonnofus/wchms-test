import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { twMerge } from "tailwind-merge";

export default function TabsMenu(props: {
    leftLabel: string;
    rightLabel: string;
    leftChildren: React.ReactNode;
    rightChildren: React.ReactNode;
    className?: string;
    tabsListClassName?: string;
}) {
    return (
        <Tabs
            defaultValue="leftLabel"
            className={twMerge(
                "flex flex-col gap-4 w-full h-full items-center",
                props.className
            )}
        >
            <TabsList className={props.tabsListClassName || undefined}>
                <TabsTrigger value="leftLabel" className="flex-1  text-center">
                    {props.leftLabel}
                </TabsTrigger>
                <TabsTrigger value="rightLabel" className="flex-1 text-center">
                    {props.rightLabel}
                </TabsTrigger>
            </TabsList>

            <TabsContent
                value="leftLabel"
                className="w-full h-full overflow-y-auto"
            >
                {props.leftChildren}
            </TabsContent>
            <TabsContent
                value="rightLabel"
                className="w-full h-full overflow-y-auto"
            >
                {props.rightChildren}
            </TabsContent>
        </Tabs>
    );
}
