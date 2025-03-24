"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Participant } from "@/db/schema/participants";
import { Score } from "@/db/schema/score";
import ScoreCard from "./score-card";

export default function ScoreList({
    scores,
    participant,
}: {
    scores: Score[] | null;
    participant: Participant;
}) {
    if (!scores || !participant) {
        return <p>Loading scores...</p>;
    }
    return (
        <div className="flex flex-col items-center w-full">
            <Card className="overflow-hidden">
                <CardHeader className="w-full py-4 md:py-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-left text-2xl md:text-[32px]">
                            Board Game Scores
                        </CardTitle>
                        <Link
                            href={`/admin/manage/participants/${participant.firstName}-${participant.lastName}/scores`}
                        >
                            <p className="text-primary-green text-sm md:text-xl font-semibold">
                                View All
                            </p>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="overflow-x-auto w-full">
                    <div className="flex overflow-x-auto space-x-4">
                        {scores.length > 0 ? (
                            scores.map((score, index) => (
                                <ScoreCard
                                    key={index}
                                    score={score}
                                    variant="list"
                                />
                            ))
                        ) : (
                            <p>No scores available</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
