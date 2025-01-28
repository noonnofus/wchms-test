import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsMenu(props: {
    leftLabel: string;
    rightLabel: string;
    leftChildren: React.ReactNode;
    rightChildren: React.ReactNode;
}) {
    return (
        <Tabs
            defaultValue="leftLabel"
            className="flex flex-col pb-6 gap-4 w-full h-full items-center overflow-y-auto"
        >
            <TabsList>
                <TabsTrigger value="leftLabel">{props.leftLabel}</TabsTrigger>
                <TabsTrigger value="rightLabel">{props.rightLabel}</TabsTrigger>
            </TabsList>
            <TabsContent value="leftLabel" className="w-full h-full">
                {props.leftChildren}
            </TabsContent>
            <TabsContent value="rightLabel" className="w-full h-full">
                {props.rightChildren}
            </TabsContent>
        </Tabs>
    );
}
