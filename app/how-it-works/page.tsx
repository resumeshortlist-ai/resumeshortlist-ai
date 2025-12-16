import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works — ResumeShortList.ai",
  description: "Upload → get a free ATS-style score → optionally upgrade once for a premium optimization output.",
};

export default function HowItWorksPage() {
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
            <h1 className="rs-h1">How it works</h1>
            <p className="rs-sub">
              Designed to beat “pretty templates” by focusing on what actually gets interviews:
              clarity, ATS readability, keyword alignment, and measurable impact.
            </p>

            <div className="rs-grid3">
              <div className="rs-card">
                <h3 className="rs-card-title">1) Upload your resume</h3>
                <p className="rs-card-desc">
                  PDF or DOCX. We scan structure, formatting, and ATS readability patterns.
                </p>
              </div>

              <div className="rs-card">
                <h3 className="rs-card-title">2) Get your free ATS-style score</h3>
                <p className="rs-card-desc">
                  You’ll see what’s hurting your score and what changes typically move it quickly.
                </p>
              </div>

              <div className="rs-card">
                <h3 className="rs-card-title">3) Upgrade once for optimization</h3>
                <p className="rs-card-desc">
                  One-time checkout to generate a premium optimized version: stronger bullets, cleaner structure,
                  better keyword alignment.
                </p>
              </div>
            </div>

            <div className="rs-divider" />

            <h2 className="rs-h2">What the score checks</h2>
            <p className="rs-sub">
              We focus on the common failure points that cause ATS parsing issues or weak screening outcomes.
            </p>

            <div className="rs-grid3">
              <div className="rs-card">
                <h3 className="rs-card-title">ATS readability</h3>
                <p className="rs-card-desc">Fonts, spacing, sections, and layout choices that break parsing.</p>
              </div>
              <div className="rs-card">
                <h3 className="rs-card-title">Impact & clarity</h3>
                <p className="rs-card-desc">Tight bullets, quantified outcomes, action verbs, and specificity.</p>
              </div>
              <div className="rs-card">
                <h3 className="rs-card-title">Keyword alignment</h3>
                <p className="rs-card-desc">Role terms, skills, and domain phrases that screeners look for.</p>
              </div>
            </div>

            <div className="rs-divider" />

            <h2 className="rs-h2">FAQ</h2>
            <div className="rs-faq">
              <div className="rs-faq-item">
                <p className="rs-faq-q">Is this just a template builder?</p>
                <p className="rs-faq-a">
                  No — templates are easy to copy. We focus on ATS-friendly structure + stronger content that improves outcomes.
                </p>
              </div>
              <div className="rs-faq-item">
                <p className="rs-faq-q">Do I need to pay to see my score?</p>
                <p className="rs-faq-a">No. The score is free. Paying is optional for the optimized output.</p>
              </div>
              <div className="rs-faq-item">
                <p className="rs-faq-q">Why one-time pricing?</p>
                <p className="rs-faq-a">
                  Subscriptions create churn and distrust. A one-time upgrade matches user intent: “fix my resume now.”
                </p>
              </div>
            </div>

            <div className="rs-actions" style={{ marginTop: 18 }}>
              <Link href="/app" className="rs-btn rs-btn-primary">Upload & get score</Link>
              <Link href="/pricing" className="rs-btn rs-btn-ghost">See pricing</Link>
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
