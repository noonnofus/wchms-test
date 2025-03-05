import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level");

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `
                        You are an assistant for seniors doing reading aloud exercises to support preventing dementia. Based on the latest news, generate 5 ${level} level of reading aloud topics that are relevant, easy to understand, and encourage discussion.

                        ### Instructions:
                        - The topics should be related to recent news events but simplified for seniors.
                        - Each topic should be short.
                        - Each topic should be interesting and engaging.
                        - Ensure the topics are suitable for casual discussion.
                        - The response have to be JSON format.

                        ### Example Output:
                        {
                            "topics": [
                                { "topic": "" },
                                { "topic": "" },
                                { "topic": "" },
                                { "topic": "" },
                                { "topic": "" },
                            ]
                        }
                    `,
                },
                {
                    role: "user",
                    content: "Generate 5 reading aloud topics",
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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const topic = body.topic;
        const level = body.level || "basic";

        if (!topic || !level) {
            return;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `
                        You are an assistant for seniors doing reading aloud exercises to support preventing dementia. 
                        Your job is to generate **one reading passage** based on the given topic and level. 
                        The passage should be relevant, easy to understand, and encourage discussion.

                        ### Instructions:
                        - **Generate exactly one passage.**
                        - The **Basic** passage must be between **170 and 230 tokens.**
                        - The **Intermediate** passage must be between **230 and 290 tokens.**
                        - Ensure the passage **length is consistent** and does not go **below 170 tokens**.
                        - If the response is too short, **extend it with additional details, examples, or explanations.**
                        - The passage should be engaging and suitable for casual discussion.
                        - The response **must be in JSON format**.

                        ### Example Output:
                        {
                            "reading": [
                                "Saitama Prefecture has been proud of Japan's highest Hina dolls for more than 50 consecutive years since 1962.
                                In the Edo period, the 3rd Shogun Iemitsu conducted a major renovation of Nikko Toshogu Shrine, which has excellent skills from all over the country
                                The craftsmen were gathered together. Iwatsuki (now Saitama City) flourished as an inn town at that time
                                In Iwatsuki Ward, craftsmen will live there.
                                Hina dolls became popular in the Edo period, and at the end of the Edo period, dolls became exclusive products of the lord of the Iwatsuki domain."
                                It has become such an important industry that it is still handed down as the best town in Japan to make dolls."
                                Yes. It is a doll made through hundreds of processes, but even now, skilled puppeteers still have the heart
                                I'm working on it manually."
                            ]
                        }
                        `,
                },
                {
                    role: "user",
                    content: `Generate a ${level} level of reading aloud exercise question of the topic ${topic}`,
                },
            ],
            temperature: 1.2,
            max_tokens: 1500,
        });

        console.log(completion.choices[0].message);
        const result = completion.choices[0].message;
        return NextResponse.json({ result: result.content }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
