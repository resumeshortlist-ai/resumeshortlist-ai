import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms — ResumeShortList.ai",
  description: "Terms of service for ResumeShortList.ai.",
};

export default function TermsPage() {
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
            <Link href="/free-ats-resume-score" className="rs-navlink">
              Free ATS Score
            </Link>
            <Link href="/how-it-works" className="rs-navlink">
              How it works
            </Link>
            <Link href="/pricing" className="rs-navlink">
              Pricing
            </Link>
            <Link href="/app" className="rs-cta">
              Try the App →
            </Link>
          </nav>
        </div>
      </header>

      <section className="rs-section">
        <div className="rs-container">
          <div className="rs-surface">
            <h1 className="rs-h1">Terms</h1>
            <p className="rs-sub">
              Simple terms that protect you while staying user-friendly. You can replace with a lawyer-reviewed version later.
            </p>

            <div className="rs-divider" />

            <div className="rs-faq">
              <div className="rs-faq-item">
                <p className="rs-faq-q">Service</p>
                <p className="rs-faq-a">
                  ResumeShortList.ai provides resume scoring and optimization guidance. Results are informational and do not
                  guarantee interviews or job offers.
                </p>
              </div>

              <div className="rs-faq-item">
                <p className="rs-faq-q">User content</p>
                <p className="rs-faq-a">
                  You own your resume content. By uploading, you grant us permission to process it to generate your score
                  and (if purchased) optimized output.
                </p>
              </div>

              <div className="rs-faq-item">
                <p className="rs-faq-q">Payments</p>
                <p className="rs-faq-a">
                  Paid upgrades are processed by Stripe. Pricing is shown at checkout. Chargebacks and refunds (if any) are handled
                  in line with your Stripe configuration and applicable consumer laws.
                </p>
              </div>

              <div className="rs-faq-item">
                <p className="rs-faq-q">Acceptable use</p>
                <p className="rs-faq-a">
                  Don’t abuse the service, attempt to disrupt it, or upload content you don’t have rights to use.
                </p>
              </div>

              <div className="rs-faq-item">
                <p className="rs-faq-q">Contact</p>
                <p className="rs-faq-a">
                  Questions:{" "}
                  <a href="mailto:support@resumeshortlist.ai" style={{ color: "rgba(255,255,255,0.92)" }}>
                    support@resumeshortlist.ai
                  </a>
                </p>
              </div>
            </div>

            <div className="rs-actions" style={{ marginTop: 18 }}>
              <Link href="/app" className="rs-btn rs-btn-primary">
                Try the App
              </Link>
              <Link href="/privacy" className="rs-btn rs-btn-ghost">
                Privacy →
              </Link>
            </div>
          </div>

          <footer className="rs-footer">
            <div className="rs-footer-inner">
              <div>© {new Date().getFullYear()} ResumeShortList.ai</div>
              <div>
                <Link className="rs-footlink" href="/privacy">
                  Privacy
                </Link>
                <Link className="rs-footlink" href="/terms">
                  Terms
                </Link>
                <Link className="rs-footlink" href="/contact">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
