import type { Metadata } from "next";
import TrackedLink from "../tracked-link";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Upload → get a free ATS score → pay once to unlock optimization + export, with optional job-description tailoring.",
  alternates: { canonical: "/how-it-works" }
};

export default function HowItWorksPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="badge">
          <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--good)" }} />
          Simple funnel • Fast results
        </div>

        <h1 className="h1">How it works</h1>
        <p className="p">
          ResumeShortList is built around a conversion-friendly flow: get value free, then pay once for the heavy lift.
        </p>

        <div className="grid cols3" style={{ marginTop: 22 }}>
          <div className="card">
            <div className="kicker">STEP 1</div>
            <div className="h2" style={{ marginTop: 8 }}>Upload</div>
            <p className="small">
              Upload a PDF or DOCX. We extract the text and evaluate ATS-safe structure.
            </p>
          </div>

          <div className="card">
            <div className="kicker">STEP 2</div>
            <div className="h2" style={{ marginTop: 8 }}>Free score</div>
            <p className="small">
              You get a score + breakdown + top fixes. No subscription. No paywall.
            </p>
          </div>

          <div className="card">
            <div className="kicker">STEP 3</div>
            <div className="h2" style={{ marginTop: 8 }}>Unlock optimization</div>
            <p className="small">
              Pay once to generate optimized output and export ATS-safe versions. Optional job tailoring.
            </p>
          </div>
        </div>

        <div className="section sm">
          <div className="grid cols2">
            <div className="card">
              <h2 className="h2">What you get for free</h2>
              <ul className="ul">
                <li className="li">Score breakdown (structure, keywords, impact, clarity)</li>
                <li className="li">Top fixes prioritized for improvement</li>
                <li className="li">ATS formatting checklist</li>
              </ul>
            </div>

            <div className="card">
              <h2 className="h2">What unlocks with payment</h2>
              <ul className="ul">
                <li className="li">Optimization output (impactful bullets + keyword guidance)</li>
                <li className="li">ATS-safe export (DOCX + PDF in later iterations)</li>
                <li className="li">Optional job description tailoring</li>
              </ul>
              <div className="heroCtas">
                <TrackedLink href="/app" className="btn primary" event="how_get_score_click">Get Free Score →</TrackedLink>
                <a href="/pricing" className="btn ghost">Pricing</a>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="h2">See the methodology</h2>
          <p className="p">
            Scores should be explainable. We publish what we check and how to improve it.
          </p>
          <div className="heroCtas">
            <a href="/methodology" className="btn primary">Score Methodology →</a>
            <a href="/free-ats-resume-score" className="btn ghost">Free ATS Score</a>
          </div>
        </div>
      </div>
    </main>
  );
}
