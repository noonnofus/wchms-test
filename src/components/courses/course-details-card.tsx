import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

export default function CourseDetailsCard(props: {
    name: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center">
            <Card>
                <CardHeader>
                    <CardTitle>{props.name}</CardTitle>
                </CardHeader>
                <Button className="bg-primary-green text-white rounded-lg min-w-[312px] w-full font-semibold text-base">
                    Start Session
                </Button>
                <CardContent>
                    <p>{props.description}</p>
                </CardContent>
            </Card>
        </div>
    );
}
