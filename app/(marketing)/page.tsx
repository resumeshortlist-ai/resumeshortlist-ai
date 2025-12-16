import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume Shortlist — ATS Evaluation + 24-hour Resume Rebuilds",
  description:
    "Upload your resume for a free ATS evaluation with an explainable score and priority fixes. Upgrade to a 24-hour resume rebuild with two revision cycles.",
  alternates: { canonical: "/" }
};

export default function HomePage() {
  return (
    <main className="section">
      <div className="container">
        <div className="grid2">
          <div>
            <div className="badge">
              <span className="dot" />
              Precision resume evaluation
            </div>

            <h1 className="h1">Your resume is failing long before a human sees it.</h1>

            <p className="p">
              Start with a <b>free ATS evaluation</b> to see how your resume performs across automated screening,
              recruiter triage, and internal review layers. Then upgrade to a <b>24-hour first-delivery</b> rebuild
              designed for Q1 2026 hiring standards.
            </p>

            <div className="ctaRow">
              <Link className="btnPrimary" href="/app">
                Upload Resume for ATS Score (Free)
              </Link>
              <Link className="btnSecondary" href="/how-it-works">
                How the Evaluation Works
              </Link>
            </div>

            <p className="fine">
              Private & confidential · No templates · Two structured revision cycles · Finalized within 5 days
            </p>
          </div>

          <div className="card">
            <div className="cardTitle">What you get (free)</div>
            <ul className="list">
              <li>ATS Compatibility Score (0–100)</li>
              <li>Verdict: why you’re being filtered early</li>
              <li>3–4 prioritized corrections</li>
              <li>Clear next steps by seniority level</li>
            </ul>
            <div className="divider" />
            <div className="muted">
              Built for professionals who expect speed, discretion, and precision — not mass-produced rewrites.
            </div>
          </div>
        </div>

        <div className="spacer" />

        <section className="grid3">
          <div className="feature">
            <div className="featureTitle">Explainable evaluation</div>
            <div className="muted">
              A transparent score breakdown — so you can see exactly what’s lowering ranking and scan performance.
            </div>
          </div>
          <div className="feature">
            <div className="featureTitle">Built for Q1 2026</div>
            <div className="muted">
              Hiring filters tighten in competitive cycles. Precision positioning determines ranking long before interviews.
            </div>
          </div>
          <div className="feature">
            <div className="featureTitle">Two revision cycles</div>
            <div className="muted">
              Structured edits, review, and finalization — finalized within 5 days of review commencement.
            </div>
          </div>
        </section>

        <div className="spacer" />

        <section className="callout">
          <h2 className="h2">When was the last time you rebuilt your resume with intention — not quick edits?</h2>
          <p className="p">
            Modern pipelines rely on pattern recognition: AI screeners, recruiter triage, manager review, HR checks, and
            approvals. Resumes that aren’t engineered for this gauntlet get filtered silently.
          </p>
          <Link className="btnPrimary" href="/app">
            Get My Free ATS Score
          </Link>
        </section>
      </div>
    </main>
  );
}
