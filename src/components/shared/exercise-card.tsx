import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExerciseCard(props: { name: string }) {
    return (
        <div className="flex flex-col items-center">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">
                        {props.name} Exercise
                    </CardTitle>
                </CardHeader>
                <Button className="bg-primary-green text-white rounded-lg w-full font-semibold text-base mb-2">
                    Start Exercise
                </Button>
            </Card>
        </div>
    );
}
