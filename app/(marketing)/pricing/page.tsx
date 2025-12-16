import type { Metadata } from "next";
import TrackedLink from "../tracked-link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free ATS resume score. Pay once ($24.99 CAD) to unlock optimization + export and optional tailoring.",
  alternates: { canonical: "/pricing" }
};

export default function PricingPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="badge">
          <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--accent)" }} />
          No subscription
        </div>

        <h1 className="h1">Simple, one‑time pricing</h1>
        <p className="p">
          Start free. Upgrade only if you want optimized output and export.
        </p>

        <div className="grid cols3" style={{ marginTop: 22 }}>
          <div className="card">
            <div className="h2" style={{ margin: "6px 0 6px" }}>Free</div>
            <div className="small">ATS score + top fixes</div>
            <div style={{ fontSize: 40, fontWeight: 900, marginTop: 12 }}>$0</div>
            <ul className="ul">
              <li className="li">Upload PDF/DOCX</li>
              <li className="li">Explainable score breakdown</li>
              <li className="li">Top fixes to improve fast</li>
            </ul>
            <div className="heroCtas">
              <TrackedLink href="/app" className="btn primary" event="pricing_free_get_score_click">
                Get Free Score →
              </TrackedLink>
            </div>
          </div>

          <div className="card" style={{ borderColor: "rgba(124,92,255,.35)" }}>
            <div className="badge" style={{ marginBottom: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--good)" }} />
              Most popular
            </div>
            <div className="h2" style={{ margin: "0 0 6px" }}>One‑time unlock</div>
            <div className="small">Optimize + export</div>
            <div style={{ fontSize: 40, fontWeight: 900, marginTop: 12 }}>$24.99 <span className="small">CAD</span></div>
            <ul className="ul">
              <li className="li">Optimization output (impact + clarity)</li>
              <li className="li">Keyword guidance (role + optional JD)</li>
              <li className="li">Export-ready ATS-safe output (MVP)</li>
            </ul>
            <div className="heroCtas">
              <TrackedLink href="/app" className="btn primary" event="pricing_unlock_click">
                Start free → then unlock
              </TrackedLink>
              <a href="/methodology" className="btn ghost">Methodology</a>
            </div>
          </div>

          <div className="card">
            <div className="h2" style={{ margin: "6px 0 6px" }}>Add‑ons (soon)</div>
            <div className="small">Optional upgrades</div>
            <div style={{ marginTop: 12 }} className="small">
              Not required for launch, but useful for revenue expansion.
            </div>
            <ul className="ul">
              <li className="li">Job tailoring packs (extra roles)</li>
              <li className="li">Cover letter generator</li>
              <li className="li">LinkedIn profile rewrite</li>
              <li className="li">Human review (48h)</li>
            </ul>
          </div>
        </div>

        <div className="section sm">
          <div className="grid cols2">
            <div className="card">
              <h2 className="h2">Refunds</h2>
              <p className="p">
                Add your policy here (placeholder). For MVP, keep it simple and fair.
              </p>
              <ul className="ul">
                <li className="li">If something breaks, we’ll fix it or refund.</li>
                <li className="li">If you’re not satisfied, contact support.</li>
              </ul>
            </div>

            <div className="card">
              <h2 className="h2">FAQ</h2>
              <div className="small" style={{ display: "grid", gap: 14 }}>
                <div>
                  <b>Do I have to pay to upload?</b>
                  <div>No — upload + score are free.</div>
                </div>
                <div>
                  <b>Is this a subscription?</b>
                  <div>No — one-time unlock.</div>
                </div>
                <div>
                  <b>Can I tailor to a job posting?</b>
                  <div>Yes — optional job description input after purchase.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="h2">Start free</h2>
          <p className="p">Get your score first. Upgrade only if you want the optimized export.</p>
          <div className="heroCtas">
            <TrackedLink href="/app" className="btn primary" event="pricing_bottom_get_score_click">
              Get Free Score →
            </TrackedLink>
          </div>
        </div>
      </div>
    </main>
  );
}
