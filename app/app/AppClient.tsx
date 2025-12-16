"use client";

import { useEffect, useMemo, useState } from "react";
import { upload } from "@vercel/blob/client";
import { useSearchParams } from "next/navigation";

type ScoreResult = {
  ok: boolean;
  score?: number;
  wordCount?: number;
  missingSections?: string[];
  topFixes?: string[];
  preview?: string;
  error?: string;
};

export default function AppClient() {
  const sp = useSearchParams();

  const sessionId = sp.get("session_id") || "";
  const blobFromUrl = sp.get("blob") || "";
  const canceled = sp.get("canceled") === "1";

  const [email, setEmail] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string>("");

  const [score, setScore] = useState<ScoreResult | null>(null);
  const [optResult, setOptResult] = useState<any>(null);

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingOptimize, setLoadingOptimize] = useState(false);
  const [err, setErr] = useState("");

  // Keep the blob URL around (so payment return can still optimize)
  useEffect(() => {
    const stored = window.localStorage.getItem("rsl_blobUrl") || "";
    if (!blobUrl && stored) setBlobUrl(stored);
  }, [blobUrl]);

  useEffect(() => {
    if (blobFromUrl) {
      setBlobUrl(blobFromUrl);
      window.localStorage.setItem("rsl_blobUrl", blobFromUrl);
    }
  }, [blobFromUrl]);

  const canScore = !!blobUrl;
  const canPay = !!blobUrl; // pay uses blobUrl metadata
  const canOptimize = !!sessionId && !!blobUrl;

  const headline = useMemo(() => {
    if (canceled) return "Checkout canceled";
    if (sessionId) return "Unlocked ✅ (payment detected in URL)";
    return "Free ATS Score";
  }, [canceled, sessionId]);

  async function doUploadAndScore() {
    setErr("");
    setOptResult(null);
    setScore(null);

    if (!file) {
      setErr("Choose a PDF or DOCX resume first.");
      return;
    }

    setLoadingUpload(true);
    try {
      const pathname = `resumes/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/resume/upload",
        clientPayload: JSON.stringify({ email: email || undefined, sessionId: sessionId || undefined }),
      });

      setBlobUrl(blob.url);
      window.localStorage.setItem("rsl_blobUrl", blob.url);

      const res = await fetch("/api/resume/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blob.url }),
      });

      const data = (await res.json()) as ScoreResult;
      if (!res.ok || !data.ok) throw new Error(data.error || "Scoring failed");
      setScore(data);
    } catch (e: any) {
      setErr(e?.message || "Upload/score failed");
    } finally {
      setLoadingUpload(false);
    }
  }

  async function goToCheckout() {
    setErr("");
    setLoadingPay(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined, blobUrl }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch (e: any) {
      setErr(e?.message || "Checkout failed");
    } finally {
      setLoadingPay(false);
    }
  }

  async function optimize() {
    setErr("");
    setLoadingOptimize(true);
    try {
      const res = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, url: blobUrl, jobDescription: jobDesc || undefined }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Optimize failed");
      setOptResult(data.optimized);
    } catch (e: any) {
      setErr(e?.message || "Optimize failed");
    } finally {
      setLoadingOptimize(false);
    }
  }

  return (
    <main style={{ maxWidth: 980, margin: "70px auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 44, marginBottom: 6 }}>ResumeShortList</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        {headline} — Upload your resume to get an instant score. Pay once to unlock optimization.
      </p>

      <div style={{ border: "1px solid #ddd", borderRadius: 14, padding: 18 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <label style={{ fontWeight: 600 }}>Email (optional)</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />

          <label style={{ fontWeight: 600 }}>Resume (PDF or DOCX)</label>
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button
            onClick={doUploadAndScore}
            disabled={loadingUpload}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            {loadingUpload ? "Uploading + Scoring…" : "Get Free Score"}
          </button>

          {blobUrl ? (
            <div style={{ fontSize: 12, color: "#666" }}>
              Uploaded: <code>{blobUrl.slice(0, 60)}…</code>
            </div>
          ) : null}
        </div>

        {score ? (
          <div style={{ marginTop: 18, borderTop: "1px solid #eee", paddingTop: 18 }}>
            <h2 style={{ margin: "0 0 8px" }}>Score: {score.score}/100</h2>
            <p style={{ marginTop: 0, color: "#555" }}>Word count: {score.wordCount}</p>

            <h3 style={{ marginBottom: 6 }}>Top fixes</h3>
            <ul style={{ marginTop: 0 }}>
              {(score.topFixes || []).map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>

            <button
              onClick={goToCheckout}
              disabled={loadingPay || !canPay}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {loadingPay ? "Redirecting…" : "Optimize + Export (one-time) — $24.99"}
            </button>
          </div>
        ) : null}

        {sessionId ? (
          <div style={{ marginTop: 18, borderTop: "1px solid #eee", paddingTop: 18 }}>
            <h2 style={{ margin: "0 0 8px" }}>Paid unlock detected ✅</h2>
            <p style={{ marginTop: 0, color: "#555" }}>
              Optional: paste a job description to tailor keywords.
            </p>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste a job description here (optional)…"
              rows={6}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />

            <div style={{ marginTop: 12 }}>
              <button
                onClick={optimize}
                disabled={loadingOptimize || !canOptimize}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #111",
                  background: "#111",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {loadingOptimize ? "Optimizing…" : "Generate Optimized Output"}
              </button>
            </div>

            {optResult ? (
              <div style={{ marginTop: 14, border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                <h3 style={{ marginTop: 0 }}>Optimization pack</h3>
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {JSON.stringify(optResult, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}

        {err ? <div style={{ color: "crimson", marginTop: 12 }}>Error: {err}</div> : null}
      </div>
    </main>
  );
}
