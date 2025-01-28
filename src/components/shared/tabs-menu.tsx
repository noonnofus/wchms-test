import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsMenu(props: {
    leftLabel: string;
    rightLabel: string;
}) {
    return (
        <Tabs
            defaultValue="leftLabel"
            className="flex flex-col px-6 gap-4 w-full h-full items-center overflow-y-auto"
        >
            <TabsList>
                <TabsTrigger value="leftLabel">{props.leftLabel}</TabsTrigger>
                <TabsTrigger value="rightLabel">{props.rightLabel}</TabsTrigger>
            </TabsList>
            <TabsContent value="leftLabel">{props.leftLabel}</TabsContent>
            <TabsContent value="rightLabel">{props.rightLabel}</TabsContent>
        </Tabs>
    );
}
