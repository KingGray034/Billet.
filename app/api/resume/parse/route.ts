import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import { getCurrentUser } from "@/server/auth";

const MAX_BYTES = 4 * 1024 * 1024;
const MIN_TEXT_LENGTH = 50;

const EXTRACTORS: Record<string, (buffer: Buffer) => Promise<string>> = {
  pdf: async (buffer) => {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  },
  docx: async (buffer) => {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  },
  md: async (buffer) => buffer.toString("utf-8"),
  txt: async (buffer) => buffer.toString("utf-8"),
};

function getExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is larger than 4MB" },
      { status: 413 },
    );
  }

  const extractor = EXTRACTORS[getExtension(file.name)];
  if (!extractor) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PDF, DOCX, MD or TXT." },
      { status: 415 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = (await extractor(buffer)).trim();

    if (text.length < MIN_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error:
            "Could not read text from this file. If it is a scanned PDF, paste the text instead.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Resume parse failed:", error);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}

export { POST };