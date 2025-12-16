import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free ATS Resume Score — ResumeShortList.ai",
  description: "Upload your resume and get a free ATS-style score with actionable fixes before you pay anything.",
};

export default function FreeAtsResumeScorePage() {
  return (
    <main className="rs-root">
      <div className="rs-bg" aria-hidden="true" />
      <div className="rs-bg2" aria-hidden="true" />
      <div className="rs-grid" aria-hidden="true" />
      <div className="rs-vignette" aria-hidden="true" />

      <header className="rs-header">
        <div className="rs-header-inner">
          <Link href="/" className="rs-brand">
            <span className="rs-brand-dot" aria-hidden="true" />
            <span>ResumeShortList.ai</span>
          </Link>

          <nav className="rs-nav" aria-label="Primary">
            <Link href="/free-ats-resume-score" className="rs-navlink">Free ATS Score</Link>
            <Link href="/how-it-works" className="rs-navlink">How it works</Link>
            <Link href="/pricing" className="rs-navlink">Pricing</Link>
            <Link href="/app" className="rs-cta">Try the App →</Link>
          </nav>
        </div>
      </header>

      <section className="rs-section">
        <div className="rs-container">
          <div className="rs-surface">
            <h1 className="rs-h1">Free ATS Resume Score</h1>
            <p className="rs-sub">
              Upload your resume and get an instant ATS-style score with actionable fixes.
              No paywall just to see results.
            </p>

            <div className="rs-actions">
              <Link href="/app" className="rs-btn rs-btn-primary">Upload & get free score</Link>
              <Link href="/pricing" className="rs-btn rs-btn-ghost">Optional upgrade</Link>
            </div>

            <div className="rs-kpirow">
              <div className="rs-kpi">
                <strong>Clarity</strong>
                <span>Do bullets communicate impact fast, or read generic?</span>
              </div>
              <div className="rs-kpi">
                <strong>ATS readability</strong>
                <span>Does formatting break parsing or confuse the scanner?</span>
              </div>
              <div className="rs-kpi">
                <strong>Keyword match</strong>
                <span>Are role keywords present without keyword stuffing?</span>
              </div>
            </div>

            <div className="rs-divider" />

            <h2 className="rs-h2">What you’ll get for free</h2>
            <div className="rs-grid3">
              <div className="rs-card">
                <h3 className="rs-card-title">ATS-style score</h3>
                <p className="rs-card-desc">A clear score and breakdown across the biggest screening factors.</p>
              </div>
              <div className="rs-card">
                <h3 className="rs-card-title">Quick-win fixes</h3>
                <p className="rs-card-desc">Concrete changes that often move the score quickly.</p>
              </div>
              <div className="rs-card">
                <h3 className="rs-card-title">Upgrade only if needed</h3>
                <p className="rs-card-desc">One-time optimization to generate a premium improved version.</p>
              </div>
            </div>

            <div className="rs-divider" />

            <h2 className="rs-h2">Why we’ll beat “pretty template” competitors</h2>
            <p className="rs-sub">
              Many tools optimize aesthetics first. We optimize outcomes: ATS readability, keyword alignment, and
              strong impact language — then present it cleanly.
            </p>

            <div className="rs-grid3">
              <div className="rs-card">
                <h3 className="rs-card-title">Outcome-first</h3>
                <p className="rs-card-desc">We prioritize the signal recruiters screen for — not just visuals.</p>
              </div>
              <div className="rs-card">
                <h3 className="rs-card-title">No subscription trap</h3>
                <p className="rs-card-desc">One-time upgrade is aligned to user intent: “fix it now.”</p>
              </div>
              <div className="rs-card">
                <h3 className="rs-card-title">SEO flywheel</h3>
                <p className="rs-card-desc">Role pages + keyword hubs feed organic growth over time.</p>
              </div>
            </div>

            <div className="rs-divider" />

            <h2 className="rs-h2">Ready?</h2>
            <p className="rs-sub">
              Get your score first. If you want the optimized output, upgrade once.
            </p>

            <div className="rs-actions" style={{ marginTop: 18 }}>
              <Link href="/app" className="rs-btn rs-btn-primary">Get my free score</Link>
              <Link href="/how-it-works" className="rs-btn rs-btn-ghost">How it works</Link>
            </div>
          </div>

          <footer className="rs-footer">
            <div className="rs-footer-inner">
              <div>© {new Date().getFullYear()} ResumeShortList.ai</div>
              <div>
                <Link className="rs-footlink" href="/privacy">Privacy</Link>
                <Link className="rs-footlink" href="/terms">Terms</Link>
                <Link className="rs-footlink" href="/contact">Contact</Link>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
