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
                <CardHeader>
                    <CardTitle className="text-center">
                        {material.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-left w-full">
                    <p>{material.content}</p>
                    {material.file && (
                        <Button
                            asChild
                            className="bg-primary-green hover:bg-[#045B47] rounded-full text-white w-full font-semibold text-base mb-2"
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
