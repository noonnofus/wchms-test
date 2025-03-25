import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getLanguageFromCookie } from "@/lib/lang";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Reading Aloud Topic Generator
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

// Reading Aloud Passage Generator
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const topic = body.topic;
        const level = body.level || "Basic";
        console.log(level);
        const lang = (await getLanguageFromCookie()) || "English";

        if (!topic) {
            return;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `
                        You are an assistant for seniors doing reading aloud exercises to support preventing dementia. 
                        Your job is to generate **one reading passage** based on the given topic, level and language. 
                        The passage should be relevant, easy to understand, and encourage discussion.

                        ### Instructions:
                        - **Generate exactly one passage.**
                        - The **Basic** passage must be between **200 and 250 tokens**.
                        - The **Intermediate** passage must be between **270 and 320 tokens**.
                        - Ensure the passage does not go **below 200 tokens** for Basic level and **270 tokens below** for Intermediate level.
                        - Ensure the passage length stays within the specified range for each level.
                        - **If the passage is too short, extend it with:**
                            - Additional background information or historical context.
                            - More descriptive details or examples.
                            - A short concluding remark summarizing the main point.
                        - The passage should be engaging and suitable for casual discussion.
                        - The response **must be in JSON format and must be fully enclosed with proper brackets ({} and []).**
                        - **Ensure the final sentence is fully formed and ends with a period.**
                        - **If the last sentence is cut off, regenerate or truncate it so that it remains a complete thought.**
                        - **The passage must always be a valid JSON string that can be parsed without errors.**
                        - **Validate that all opening brackets {[ have corresponding closing brackets }].**
                        - **Do not output incomplete JSON objects.**
                        ### Example Output:
                        {
                            \"reading\": [
                                \"Coffee is one of the most popular beverages in the world.\",
                                \"It is grown in countries such as Colombia, Brazil, and Ethiopia.\",
                                \"There are two main types of coffee beans: Arabica and Robusta.\",
                                \"Arabica beans are smooth and aromatic, while Robusta beans are strong and contain more caffeine.\",
                                \"Many people enjoy drinking coffee in various forms, such as filter coffee, espresso, or cappuccino.\",
                                \"In some cultures, coffee drinking is a daily ritual that brings people together.\",
                                \"Historically, coffeehouses have been places for discussion and social interaction.\"
                            ]
                        }
                    `,
                },
                {
                    role: "user",
                    content: `Generate a ${level} level of reading aloud exercise question of the topic ${topic} in ${lang}`,
                },
            ],
            temperature: 1.0,
            max_tokens: level === "Basic" ? 300 : 400,
        });

        const result = completion.choices[0].message;

        console.log(result);
        return NextResponse.json({ result: result.content }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
