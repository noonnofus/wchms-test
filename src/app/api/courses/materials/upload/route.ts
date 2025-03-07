import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as Blob;

        const arrayBuffer = await file.arrayBuffer();
        const pdfBuffer = Buffer.from(arrayBuffer);

        const fileName = `document_${Date.now()}.pdf`;
        const filePath = path.join(
            process.cwd(),
            "public",
            "materials",
            fileName
        );

        fs.writeFileSync(filePath, pdfBuffer);

        return NextResponse.json({
            success: true,
            filePath: `/materials/${fileName}`,
        });
    } catch (error) {
        console.error("Error generating PDF:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
