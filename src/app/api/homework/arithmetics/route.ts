import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const level = body.level || "basic";

        let msg = `
                    Generate 15 math questions of ${level} level for seniors in markdown. 
                    The questions should be simple and focus on addition, subtraction, multiplication, or division.  
                    Ensure that each question is clear, supports brain exercises, and follows these instructions:  
                    
                    - Questions should be unique and randomly generated every time.  
                    - Format the output in JSON as:
                    {
                        "questions": [
                          { "question": "5 + 3", "answer": "8" },
                          { "question": "12 - 4", "answer": "8" },
                          { "question": "6 × 7", "answer": "42" },
                          { "question": "36 ÷ 6", "answer": "6" }
                        ]
                    }
                `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an assistant for seniors who are doing brain exercises to prevent dementia. Your job is to generate simple reading or mathematics homework. Always provide tasks that are easy to solve and suitable for seniors.",
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
        return NextResponse.json({ chat: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

// TODO: Need to get the arithemetic questions with following format below.
/*
{
  "questions": [
    { "question": "5 + 3", "answer": "8" },
    { "question": "12 - 4", "answer": "8" },
    { "question": "6 × 7", "answer": "42" },
    { "question": "36 ÷ 6", "answer": "6" }
  ]
}
*/
