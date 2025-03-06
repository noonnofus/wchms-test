import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const level = body.level || "basic";

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `
                        You are an assistant for seniors doing reading aloud exercises to support preventing dementia. Your job is to generate **15 mathematics questions with answers** based on the given level. Always provide tasks that are easy to solve and suitable for seniors.

                        ### Instructions:
                        - **Generate 15 mathematics questions with answers.**
                        - The answer must be **integer**.
                        - The questions must only be **add, subtract, multiply, and division**
                        - The **Basic** level questions must only be contain **add and subtract**
                        - The **Intermediate** level questions must also be contain **multiply and division**
                        - The question should be engaging and suitable for casual discussion.
                        - The response **must be in JSON format**.

                        ### Example Output:
                        "questions": [
                          { "question": "5 + 3", "answer": "8" },
                          { "question": "12 - 4", "answer": "8" },
                          { "question": "6 × 7", "answer": "42" },
                          { "question": "36 ÷ 6", "answer": "6" }
                        ]
                        `,
                },
                {
                    role: "user",
                    content: `Generate a ${level} level of 15 arithmetics exercise questions`,
                },
            ],
            temperature: 0.7,
        });

        const result = completion.choices[0].message;
        return NextResponse.json({ result: result.content }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
