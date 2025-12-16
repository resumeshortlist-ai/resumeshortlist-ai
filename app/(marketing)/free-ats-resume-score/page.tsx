import type { Metadata } from "next";
import TrackedLink from "../tracked-link";

export const metadata: Metadata = {
  title: "Free ATS Resume Score",
  description:
    "Upload your resume and get a free ATS-style score with a transparent breakdown and the top fixes to improve it.",
  alternates: { canonical: "/free-ats-resume-score" }
};

function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default function FreeAtsScorePage() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What file types are supported?", acceptedAnswer: { "@type": "Answer", text: "PDF and DOCX are supported." } },
      { "@type": "Question", name: "How fast is the score?", acceptedAnswer: { "@type": "Answer", text: "Typically about a minute for most resumes." } },
      { "@type": "Question", name: "What does the score include?", acceptedAnswer: { "@type": "Answer", text: "Structure/ATS checks, section completeness, clarity, impact/metrics signals, and keyword coverage." } }
    ]
  };

  return (
    <main className="section">
      <JsonLd data={faq} />
      <div className="container">
        <div className="badge">
          <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--accent2)" }} />
          High‑intent ATS checker
        </div>
        <h1 className="h1">Free ATS Resume Score</h1>
        <p className="p">
          Upload your resume to get an <b>explainable score</b> with the top fixes that improve ATS parsing and clarity.
          No subscription required.
        </p>

        <div className="heroCtas">
          <TrackedLink href="/app" className="btn primary" event="free_score_get_score_click">
            Get Free Score →
          </TrackedLink>
          <a href="/methodology" className="btn ghost">How scoring works</a>
        </div>

        <div className="grid cols3" style={{ marginTop: 22 }}>
          <div className="card">
            <div className="h3">ATS structure</div>
            <div className="small">Headings, sections, and parsing-safe formatting.</div>
          </div>
          <div className="card">
            <div className="h3">Keywords</div>
            <div className="small">Skills and experience coverage for your target role.</div>
          </div>
          <div className="card">
            <div className="h3">Impact</div>
            <div className="small">Metrics, scope, and outcome language that reads senior.</div>
          </div>
        </div>

        <div className="section sm">
          <div className="card">
            <h2 className="h2">Why most “resume scores” feel random</h2>
            <p className="p">
              If you can’t see what changed your score, you can’t trust it. ResumeShortList is designed to be
              <b> transparent</b>—you’ll see the categories, the checks, and actionable next steps.
            </p>
            <ul className="ul">
              <li className="li">Clear categories (structure, keywords, impact, clarity, completeness)</li>
              <li className="li">Top fixes prioritized by effort vs. impact</li>
              <li className="li">Optional job description for role-fit keyword guidance</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h2 className="h2">Ready to try?</h2>
          <p className="p">Start free. Upgrade only if you want the optimized export.</p>
          <div className="heroCtas">
            <TrackedLink href="/app" className="btn primary" event="free_score_bottom_get_score_click">
              Get Free Score →
            </TrackedLink>
            <a href="/pricing" className="btn ghost">Pricing</a>
          </div>
        </div>
      </div>
    </main>
  );
}
