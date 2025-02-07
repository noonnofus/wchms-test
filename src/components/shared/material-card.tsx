import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Material {
    title: string;
    content: string | null;
    createdAt: Date;
    file: string | null;
}

export default function MaterialCard({ material }: { material: Material }) {
    return (
        <div className="flex flex-col items-center">
            <Card>
                <CardHeader className="py-0 pt-6">
                    <CardTitle className="text-center">
                        {material.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-left w-full flex flex-col gap-4">
                    {material.content && <p>{material.content}</p>}
                    {material.file && (
                        <Button
                            asChild
                            className="bg-primary-green hover:bg-[#045B47] rounded-full text-white w-full font-semibold text-base min-h-[45px]"
                        >
                            <a href={material.file} download={material.file}>
                                {/* File type needs to dynamically rendered when files are implemented */}
                                Download File (PDF)
                            </a>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
