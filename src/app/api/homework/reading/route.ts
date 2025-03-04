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

        let msg = `
                    Generate a ${level} level reading exercise on ${topic} for seniors in markdown.  
                    The exercise should include a short passage (approximately 100-150 words) that is easy to understand.  
                    Ensure that the content is clear and designed to support cognitive health.  
                    
                    Format the passage in markdown.  
                    - Use **bold** formatting for one or two sentences in the passage that seniors should read aloud.  
                    - Keep the language simple and engaging.  
                    - The topic should be relevant to seniors and encourage discussion.  
                    
                    Example output:  
                    
                    \`\`\`markdown  
                    ## Easy Level Reading Exercise: The Benefits of Walking  
                    
                    Walking is a simple yet powerful way to stay healthy. It helps keep the heart strong and improves mood. Doctors recommend walking at least 30 minutes a day to maintain good health.  
                    
                    **"Walking outside in fresh air can make you feel more energetic and happy."**  
                    
                    Many seniors find that walking with friends makes the activity more enjoyable. It is a great way to stay connected with others while staying active.  
                    \`\`\`
                `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an assistant for seniors who are doing brain exercises to prevent dementia. Your job is to generate simple reading homework. Always provide tasks that are easy to solve and suitable for seniors.",
                },
                {
                    role: "user",
                    content: `${msg}`,
                },
            ],
            temperature: 0.7,
        });

        console.log(completion.choices[0].message);
        const result = completion.choices[0].message;
        return NextResponse.json({ result: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
