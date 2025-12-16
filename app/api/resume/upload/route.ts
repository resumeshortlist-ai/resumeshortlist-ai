// app/api/resume/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { verifyAccessToken } from "../../../../lib/accessToken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MB = 8;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function isAllowed(filename: string) {
  const lower = filename.toLowerCase();
  return lower.endsWith(".pdf") || lower.endsWith(".doc") || lower.endsWith(".docx");
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: Request) {
  // Require paid/unlocked cookie
  const token = cookies().get("rsl_access")?.value || "";
  const payload = token ? verifyAccessToken(token) : null;

  if (!payload) {
    const url = new URL(req.url);
    return NextResponse.redirect(new URL("/app?error=locked", url.origin));
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Missing BLOB_READ_WRITE_TOKEN. Connect Vercel Blob and redeploy." },
      { status: 500 }
    );
  }

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
      return NextResponse.json({ error: `File too large. Max ${MAX_MB}MB.` }, { status: 400 });
    }

    const key = `resumes/${payload.sid}/${Date.now()}-${safeFileName(file.name)}`;

    // NOTE: Your current @vercel/blob types require `access` and only accept "public"
    const blob = await put(key, file, {
      access: "public",
      contentType: file.type || undefined,
      addRandomSuffix: false,
    });

    console.log("✅ Resume stored in Blob:", {
      key,
      url: blob.url,
      size: file.size,
      email: payload.email,
      sid: payload.sid,
    });

    const url = new URL(req.url);
    return NextResponse.redirect(
      new URL(`/app?uploaded=1&file=${encodeURIComponent(file.name)}`, url.origin)
    );
  } catch (e: any) {
    console.error("Upload error:", e?.message);
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}
