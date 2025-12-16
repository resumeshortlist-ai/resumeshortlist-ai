import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — ResumeShortList.ai",
  description: "Get a free ATS-style score, then optionally upgrade once for a premium optimization.",
};

export default function PricingPage() {
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
            <h1 className="rs-h1">Simple pricing that doesn’t punish you monthly</h1>
            <p className="rs-sub">
              Start free. If you want the optimized resume output, upgrade once. No subscription pressure.
            </p>

            <div className="rs-price-grid">
              <div className="rs-price-card">
                <div className="rs-price-top">
                  <div className="rs-price-name">Free Score</div>
                  <div className="rs-price-tag">Always free</div>
                </div>
                <div className="rs-price">$0</div>
                <ul className="rs-bullets">
                  <li>ATS-style score + section checks</li>
                  <li>Formatting/readability flags</li>
                  <li>Keyword alignment hints</li>
                  <li>Quick-win checklist</li>
                </ul>
                <div className="rs-actions">
                  <Link href="/app" className="rs-btn rs-btn-primary">Get free score</Link>
                  <Link href="/free-ats-resume-score" className="rs-btn rs-btn-ghost">Learn more</Link>
                </div>
                <div className="rs-tiny">Best for: understanding what’s holding your resume back.</div>
              </div>

              <div className="rs-price-card featured">
                <div className="rs-price-top">
                  <div className="rs-price-name">One-Time Optimization</div>
                  <div className="rs-price-tag">Most popular</div>
                </div>
                <div className="rs-price">
                  One-time <small>(set in Stripe)</small>
                </div>
                <ul className="rs-bullets">
                  <li>Optimized resume version generated for you</li>
                  <li>Tighter bullets + stronger impact language</li>
                  <li>Cleaner ATS-friendly formatting</li>
                  <li>Keyword-aligned rewrite suggestions</li>
                </ul>
                <div className="rs-actions">
                  <Link href="/app" className="rs-btn rs-btn-primary">Upload → checkout → optimize</Link>
                  <Link href="/how-it-works" className="rs-btn rs-btn-ghost">See how it works</Link>
                </div>
                <div className="rs-tiny">
                  Best for: candidates who want a polished, “ready-to-send” version without hiring a writer.
                </div>
              </div>

              <div className="rs-price-card">
                <div className="rs-price-top">
                  <div className="rs-price-name">Teams (later)</div>
                  <div className="rs-price-tag">Coming soon</div>
                </div>
                <div className="rs-price">Custom</div>
                <ul className="rs-bullets">
                  <li>Recruiting teams + cohorts</li>
                  <li>Standardized scoring + guidance</li>
                  <li>Shared templates + role keyword hubs</li>
                  <li>Admin + reporting</li>
                </ul>
                <div className="rs-actions">
                  <Link href="/contact" className="rs-btn rs-btn-ghost">Contact us</Link>
                </div>
                <div className="rs-tiny">Best for: bootcamps, universities, and recruiting teams.</div>
              </div>
            </div>

            <div className="rs-divider" />

            <div className="rs-kpirow">
              <div className="rs-kpi">
                <strong>No subscription</strong>
                <span>One-time upgrade to avoid “resume tool fatigue.”</span>
              </div>
              <div className="rs-kpi">
                <strong>Value first</strong>
                <span>The free score is actually useful — not a teaser.</span>
              </div>
              <div className="rs-kpi">
                <strong>Clear next steps</strong>
                <span>We tell you what to fix and what moves the score.</span>
              </div>
            </div>

            <div className="rs-faq">
              <div className="rs-faq-item">
                <p className="rs-faq-q">Is the free score really free?</p>
                <p className="rs-faq-a">Yes. You can upload and get your ATS-style score without paying.</p>
              </div>
              <div className="rs-faq-item">
                <p className="rs-faq-q">What does the upgrade do?</p>
                <p className="rs-faq-a">
                  It produces an improved, ATS-aligned resume output: stronger bullets, clearer structure,
                  and better keyword alignment.
                </p>
              </div>
              <div className="rs-faq-item">
                <p className="rs-faq-q">Do you lock me into recurring billing?</p>
                <p className="rs-faq-a">No. This is designed as a one-time checkout.</p>
              </div>
            </div>

            <div className="rs-actions" style={{ marginTop: 18 }}>
              <Link href="/app" className="rs-btn rs-btn-primary">Try the App</Link>
              <Link href="/" className="rs-btn rs-btn-ghost">Back to home</Link>
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
