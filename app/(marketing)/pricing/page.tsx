import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Resume Shortlist",
  description:
    "Fixed-price 24-hour resume rebuilds by seniority level. Two revision cycles included. Interview prep available.",
  alternates: { canonical: "/pricing" }
};

const TIERS = [
  { name: "Entry Level", price: 50, desc: "Early-career clarity and ATS-safe structure." },
  { name: "Mid-Level", price: 100, desc: "Achievement framing and progression narrative." },
  { name: "Senior Level", price: 200, desc: "Strategic scope, influence, and leadership signal." },
  { name: "Executive Level", price: 400, desc: "Authority, strategic outcomes, and enterprise alignment." }
];

export default function PricingPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="h1">Engagement Levels</h1>
        <p className="p">
          Start with a <b>free ATS evaluation</b>. If you want a rebuild, choose the engagement level that matches your
          seniority and hiring expectations.
        </p>

        <div className="pricingGrid">
          {TIERS.map((t) => (
            <div key={t.name} className="card">
              <div className="cardTitle">{t.name}</div>
              <div className="price">${t.price}</div>
              <div className="muted">{t.desc}</div>
              <div className="divider" />
              <ul className="list">
                <li>24-hour first delivery</li>
                <li>Up to 2 structured revision cycles</li>
                <li>Finalized within 5 days of review start</li>
                <li>Private & confidential</li>
              </ul>
              <Link className="btnPrimary block" href="/contact">
                Request Rebuild
              </Link>
            </div>
          ))}

          <div className="card">
            <div className="cardTitle">Interview Preparation</div>
            <div className="price">$100</div>
            <div className="muted">1-hour session focused on narrative alignment and role-specific positioning.</div>
            <div className="divider" />
            <ul className="list">
              <li>Role-specific story + impact framing</li>
              <li>Executive-ready behavioral answers</li>
              <li>Closing strategy + objections</li>
            </ul>
            <Link className="btnPrimary block" href="/contact">
              Book Interview Prep
            </Link>
          </div>
        </div>

        <div className="spacer" />

        <div className="callout">
          <h2 className="h2">Q1 2026 is a tightening hiring cycle.</h2>
          <p className="p">
            Hiring filters become more aggressive. Your resume must survive ATS parsing, recruiter triage, and internal
            review layers. Precision positioning determines ranking long before interviews.
          </p>
          <Link className="btnSecondary" href="/app">
            Get My Free ATS Score
          </Link>
        </div>
      </div>
    </main>
  );
}
