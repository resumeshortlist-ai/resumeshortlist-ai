import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Score Methodology",
  description:
    "Transparent methodology: how ResumeShortList scores ATS structure, keywords, impact, clarity, and completeness.",
  alternates: { canonical: "/methodology" }
};

export default function MethodologyPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="badge">
          <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--accent2)" }} />
          Transparency first
        </div>

        <h1 className="h1">Resume Score Methodology</h1>
        <p className="p">
          Resume scores shouldn’t be a black box. Here’s what we check, what helps, what hurts, and how to improve fast.
        </p>

        <div className="section sm">
          <div className="grid cols2">
            <div className="card">
              <div className="h2">1) ATS Structure</div>
              <p className="small">
                We look for clean parsing and predictable structure.
              </p>
              <ul className="ul">
                <li className="li">Standard headings (Experience, Education, Skills)</li>
                <li className="li">One-column layout</li>
                <li className="li">Avoid tables/columns that confuse parsers</li>
                <li className="li">Consistent dates and job titles</li>
              </ul>
            </div>

            <div className="card">
              <div className="h2">2) Keywords</div>
              <p className="small">
                We surface missing keywords and suggest where to place them naturally.
              </p>
              <ul className="ul">
                <li className="li">Skills section coverage</li>
                <li className="li">Keyword presence in recent experience</li>
                <li className="li">Optional job description alignment</li>
              </ul>
            </div>

            <div className="card">
              <div className="h2">3) Impact & Metrics</div>
              <p className="small">
                Senior resumes prove outcomes. We look for measurable impact signals.
              </p>
              <ul className="ul">
                <li className="li">% / $ / time saved / volume / SLA improvements</li>
                <li className="li">Scope (team size, region, budget, stakeholders)</li>
                <li className="li">Action verbs + outcome language</li>
              </ul>
            </div>

            <div className="card">
              <div className="h2">4) Clarity & Readability</div>
              <p className="small">
                ATS is step one; humans still decide. We score for clarity.
              </p>
              <ul className="ul">
                <li className="li">Concise bullets (avoid walls of text)</li>
                <li className="li">Consistent formatting</li>
                <li className="li">Role-appropriate narrative and ordering</li>
              </ul>
            </div>

            <div className="card">
              <div className="h2">5) Completeness</div>
              <p className="small">
                Missing basics can tank parsing and recruiter confidence.
              </p>
              <ul className="ul">
                <li className="li">Contact info present and parseable</li>
                <li className="li">Key sections included</li>
                <li className="li">Basic length heuristics</li>
              </ul>
            </div>

            <div className="card">
              <div className="h2">What we don’t do</div>
              <ul className="ul">
                <li className="li">No “mystery” scoring with hidden criteria</li>
                <li className="li">No subscriptions by default</li>
                <li className="li">No selling personal data</li>
              </ul>
              <p className="small" style={{ marginTop: 10 }}>
                MVP note: uploaded files are stored to process scoring and unlock export. Treat sensitive info accordingly.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="h2">Common ATS failures</h2>
          <div className="grid cols3" style={{ marginTop: 12 }}>
            <div className="card flat">
              <div className="h3">Tables & columns</div>
              <div className="small">Often scramble reading order.</div>
            </div>
            <div className="card flat">
              <div className="h3">Headers/footers</div>
              <div className="small">Key info can be dropped or misread.</div>
            </div>
            <div className="card flat">
              <div className="h3">Icons as text</div>
              <div className="small">ATS can’t parse icons reliably.</div>
            </div>
          </div>

          <div className="heroCtas" style={{ marginTop: 18 }}>
            <a href="/app" className="btn primary">Get Free Score →</a>
            <a href="/how-it-works" className="btn ghost">How it works</a>
          </div>
        </div>
      </div>
    </main>
  );
}
