// app/api/resume/optimize/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

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

function simpleOptimize(text: string, jobDescription?: string) {
  const t = text.replace(/\s+/g, " ").trim();
  const jd = (jobDescription || "").toLowerCase();

  const recommendedBullets = [
    "Start bullets with strong action verbs (Led, Built, Delivered, Owned, Optimized).",
    "Add measurable impact (%, $, time, volume, SLA, headcount).",
    "Move core keywords from the job description into Skills + Experience.",
    "Keep formatting ATS-friendly (single column, consistent headings, plain text dates)."
  ];

  const keywordHints: string[] = [];
  if (jd.includes("stakeholder")) keywordHints.push("Stakeholder management");
  if (jd.includes("strategy")) keywordHints.push("Strategy & execution");
  if (jd.includes("operat")) keywordHints.push("Operating model / Ops excellence");
  if (jd.includes("data") || jd.includes("analytics")) keywordHints.push("Data-driven decision making");
  if (jd.includes("program") || jd.includes("pmo")) keywordHints.push("Program / PMO leadership");

  return {
    summaryRewriteTemplate:
      "Executive leader with X+ years driving [strategy/ops], delivering [metric outcomes], partnering with [stakeholders], and scaling [teams/process/tech] across [regions/industries].",
    bulletUpgradeTemplate:
      "Action verb + what you did + how you did it + measurable outcome (e.g., “Led global cost-to-serve program across 4 regions, reducing run-rate costs by 12% while improving SLA by 18%”).",
    recommendedBullets,
    keywordHints: [...new Set(keywordHints)].slice(0, 10),
    note:
      "MVP output: next step is a full AI rewrite + DOCX/PDF export once we add the rewrite engine."
  };
}

export async function POST(req: Request) {
  try {
    const { sessionId, url, jobDescription } = (await req.json()) as {
      sessionId?: string;
      url?: string;
      jobDescription?: string;
    };

    if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid" || session.status === "complete";
    if (!paid) return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 });

    const text = await extractText(url);
    const optimized = simpleOptimize(text, jobDescription);

    return NextResponse.json({ ok: true, optimized });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Optimize failed" }, { status: 400 });
  }
}
