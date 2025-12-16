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

  const [selectedTier, setSelectedTier] = useState("Executive Level");

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

  function verdictFor(scoreNum: number) {
  if (scoreNum < 55) {
    return {
      title: "Verdict: Your resume is being filtered early.",
      body:
        "Your experience isn’t coming through with enough clarity, alignment, or signal density to survive automated screening and recruiter scan patterns."
    };
  }
  if (scoreNum < 75) {
    return {
      title: "Verdict: Your resume is under-positioning your real value.",
      body:
        "Your experience is credible, but the narrative is misaligned with how modern hiring decisions are made. This costs ranking before interviews are considered."
    };
  }
  if (scoreNum < 90) {
    return {
      title: "Verdict: Strong foundation — missing precision positioning.",
      body:
        "Your resume is credible, but it isn’t extracting maximum value. Small, intentional changes can materially improve shortlist outcomes."
    };
  }
  return {
    title: "Verdict: High-performing resume with minor optimization headroom.",
    body:
      "Your positioning is strong. We can tighten signal, clarify scope, and sharpen impact for specific roles."
  };
}

const tierOptions = [
  { label: "Entry Level", price: 50 },
  { label: "Mid-Level", price: 100 },
  { label: "Senior Level", price: 200 },
  { label: "Executive Level", price: 400 }
];

return (
  <main className="section">
    <div className="container">
      <div className="badge">
        <span className="dot" />
        ATS Evaluation (Free)
      </div>

      <h1 className="h1">Your resume has been evaluated.</h1>
      <p className="p">
        This assessment estimates performance across <b>ATS screening</b>, <b>recruiter triage</b>, and internal review
        layers — not how it reads to you.
      </p>

      <div className="spacerSmall" />

      {/* Upload card */}
      {!score && (
        <div className="card">
          <div className="grid2">
            <div>
              <div className="cardTitle">Upload your resume</div>
              <p className="muted">
                PDF or DOCX. You’ll receive a score, a clear verdict, and 3–4 prioritized corrections.
              </p>

              <div className="form">
                <label className="label">Email (optional)</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="input"
                />

                <label className="label">Resume (PDF or DOCX)</label>
                <input
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="inputFile"
                />

                <button onClick={doUploadAndScore} disabled={loadingUpload} className="btnPrimary">
                  {loadingUpload ? "Analyzing…" : "Generate ATS Score (Free)"}
                </button>

                {score?.error && <p className="error">{score.error}</p>}
              </div>
            </div>

            <div className="calloutSoft">
              <div className="cardTitle">Why this matters in Q1 2026</div>
              <p className="muted">
                Hiring filters tighten during competitive cycles. Your resume is evaluated across automated screeners,
                recruiter scan patterns, manager review, HR checks, and approvals. Resumes not rebuilt with intention are
                filtered out silently.
              </p>
              <p className="muted">
                <b>When was the last time you rebuilt your resume with intention — not quick edits?</b>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {score?.ok && typeof score.score === "number" && (
        <div className="resultsGrid">
          <div>
            <div className="card">
              {(() => {
                const v = verdictFor(score.score!);
                return (
                  <>
                    <div className="verdictTitle">{v.title}</div>
                    <div className="muted">{v.body}</div>
                  </>
                );
              })()}
            </div>

            <div className="spacerSmall" />

            <div className="card">
              <div className="row">
                <div>
                  <div className="cardTitle">ATS Compatibility Score</div>
                  <div className="score">{score.score}/100</div>
                  <div className="muted">
                    This score suggests how your resume performs through parsing, ranking, and scan patterns.
                  </div>
                </div>
                <div className="scoreBarWrap">
                  <div className="scoreBar" style={{ width: `${Math.min(100, Math.max(0, score.score))}%` }} />
                </div>
              </div>

              <div className="divider" />

              <div className="grid2">
                <div className="mini">
                  <div className="miniLabel">Formatting & Parse Integrity</div>
                  <div className="miniValue">{(score.score ?? 0) >= 70 ? "Strong" : "Moderate"}</div>
                </div>
                <div className="mini">
                  <div className="miniLabel">Keyword Alignment</div>
                  <div className="miniValue">{(score.score ?? 0) >= 80 ? "Strong" : "Moderate"}</div>
                </div>
                <div className="mini">
                  <div className="miniLabel">Impact Signal Strength</div>
                  <div className="miniValue">{(score.score ?? 0) >= 85 ? "Strong" : "Needs work"}</div>
                </div>
                <div className="mini">
                  <div className="miniLabel">Role-Specific Targeting</div>
                  <div className="miniValue">{(score.score ?? 0) >= 80 ? "Strong" : "Moderate"}</div>
                </div>
              </div>
            </div>

            <div className="spacerSmall" />

            <div className="card">
              <div className="cardTitle">Key issues identified (priority order)</div>
              <div className="muted">These are the highest-impact corrections to improve shortlist probability.</div>

              <div className="spacerSmall" />

              <div className="recoGrid">
                {(score.topFixes?.slice(0, 4) ?? [
                  "Replace responsibility bullets with outcomes. Recruiters rank based on change created, not tasks performed.",
                  "Fix role signal targeting. A generalist profile lowers ranking for specialized roles.",
                  "Increase signal density in the top third with scope, metrics, and business context.",
                  "Tighten ATS formatting to reduce parsing loss across different systems."
                ]).map((fix, idx) => (
                  <div key={idx} className="recoCard">
                    <div className="recoKicker">Priority {idx + 1}</div>
                    <div className="recoText">{fix}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="spacerSmall" />

            <div className="callout">
              <h2 className="h2">Why this matters in Q1 2026</h2>
              <p className="p">
                Organizations are relying more heavily on automated filters, resume rankers, and recruiter pattern
                recognition to manage volume. Your resume is evaluated long before interviews are discussed — across
                multiple companies, each with different thresholds.
              </p>
              <p className="p">
                <b>Resumes that aren’t intentionally engineered are filtered out silently.</b>
              </p>
            </div>
          </div>

          {/* Conversion panel */}
          <aside className="sidePanel">
            <div className="sideTitle">Move to a shortlist-ready resume</div>
            <div className="muted">24-hour first delivery · 2 revision cycles · finalized within 5 days</div>

            <div className="divider" />

            <label className="label">Engagement level</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="select"
            >
              {tierOptions.map((t) => (
                <option key={t.label} value={t.label}>
                  {t.label} — ${t.price}
                </option>
              ))}
            </select>

            <a className="btnPrimary block" href="/contact">
              Request Resume Rebuild
            </a>

            <div className="spacerSmall" />

            <div className="sideSub">Interview preparation</div>
            <div className="muted">1-hour session — $100</div>
            <a className="btnSecondary block" href="/contact">
              Book Interview Prep
            </a>

            <div className="divider" />

            <div className="fine">
              Private & confidential · No templates · No mass rewrites
            </div>
          </aside>
        </div>
      )}
    </div>
  </main>
);
}
