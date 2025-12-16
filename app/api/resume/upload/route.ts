// app/api/resume/upload/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MB = 8;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function isAllowed(filename: string) {
  const lower = filename.toLowerCase();
  return lower.endsWith(".pdf") || lower.endsWith(".doc") || lower.endsWith(".docx");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("resume");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file field: resume" }, { status: 400 });
    }

    if (!isAllowed(file.name)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PDF, DOC, or DOCX." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max ${MAX_MB}MB.` },
        { status: 400 }
      );
    }

    // Read bytes (we’ll use this later to upload to storage)
    const bytes = await file.arrayBuffer();

    // For now: just log metadata (no storage yet)
    console.log("✅ Resume upload received:", {
      name: file.name,
      type: file.type,
      size: file.size,
      bytes: bytes.byteLength,
    });

    // Redirect user back to /app with a success flag
    const url = new URL(req.url);
    return NextResponse.redirect(new URL(`/app?uploaded=1&file=${encodeURIComponent(file.name)}`, url.origin));
  } catch (e: any) {
    console.error("Upload error:", e?.message);
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}
