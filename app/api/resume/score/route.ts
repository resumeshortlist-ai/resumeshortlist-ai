// app/api/resume/score/route.ts
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function scoreResume(text: string) {
  const t = normalize(text);
  const lower = t.toLowerCase();

  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(t);
  const hasPhone = /(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?)\d{3}[\s-]?\d{4}/.test(t);

  const sections = {
    summary: /(summary|profile|objective)/i.test(t),
    experience: /(experience|employment|work history)/i.test(t),
    education: /(education|school|university|college)/i.test(t),
    skills: /(skills|technical skills|core competencies)/i.test(t)
  };

  const wordCount = t ? t.split(" ").length : 0;
  const hasBullets = /•|\n- |\n\* /.test(text);
  const hasMetrics = /\b\d+(\.\d+)?%?\b/.test(t);

  // Very simple ATS-ish scoring (MVP)
  let score = 0;
  score += hasEmail ? 12 : 0;
  score += hasPhone ? 8 : 0;
  score += sections.summary ? 10 : 0;
  score += sections.experience ? 20 : 0;
  score += sections.education ? 12 : 0;
  score += sections.skills ? 18 : 0;
  score += hasBullets ? 10 : 0;
  score += hasMetrics ? 10 : 0;

  // Length heuristic
  if (wordCount >= 350 && wordCount <= 900) score += 10;
  else if (wordCount >= 250 && wordCount < 350) score += 6;
  else if (wordCount > 900) score += 3;

  if (score > 100) score = 100;

  const missing = Object.entries(sections)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  const fixes: string[] = [];
  if (!hasEmail) fixes.push("Add a professional email address in the header.");
  if (!hasPhone) fixes.push("Add a phone number (ATS-friendly, plain text).");
  if (!sections.skills) fixes.push("Add a dedicated Skills section with keywords.");
  if (!hasBullets) fixes.push("Use bullet points for experience (ATS-friendly structure).");
  if (!hasMetrics) fixes.push("Add measurable outcomes (%, $, time saved, volume, SLA).");
  if (!sections.summary) fixes.push("Add a 2–3 line Summary tailored to your target role.");

  return {
    score,
    wordCount,
    checks: { hasEmail, hasPhone, hasBullets, hasMetrics, ...sections },
    missingSections: missing,
    topFixes: fixes.slice(0, 6),
    preview: t.slice(0, 900)
  };
}

async function extractText(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch uploaded file (${res.status})`);

  const contentType = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());

  if (contentType.includes("pdf") || url.toLowerCase().endsWith(".pdf")) {
    const out = await pdfParse(buf);
    return out.text || "";
  }

  if (
    contentType.includes("wordprocessingml.document") ||
    url.toLowerCase().endsWith(".docx")
  ) {
    const out = await mammoth.extractRawText({ buffer: buf });
    return out.value || "";
  }

  throw new Error(`Unsupported file type: ${contentType || "unknown"}`);
}

export async function POST(req: Request) {
  try {
    const { url } = (await req.json()) as { url?: string };
    if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

    const text = await extractText(url);
    const result = scoreResume(text);

    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Scoring failed" }, { status: 400 });
  }
}
