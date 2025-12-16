import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — ResumeShortList.ai",
  description: "Get in touch with ResumeShortList.ai.",
};

export default function ContactPage() {
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
            <h1 className="rs-h1">Contact</h1>
            <p className="rs-sub">
              For support, partnerships, or product feedback, email us and include your Stripe{" "}
              <b>session_id</b> (if relevant).
            </p>

            <div className="rs-divider" />

            <div className="rs-grid3">
              <div className="rs-card">
                <h3 className="rs-card-title">Support</h3>
                <p className="rs-card-desc">
                  Payment, upload, or scoring issues? Send details and screenshots if you have them.
                </p>
                <div className="rs-actions" style={{ marginTop: 12 }}>
                  <a className="rs-btn rs-btn-primary" href="mailto:support@resumeshortlist.ai">
                    Email support →
                  </a>
                </div>
              </div>

              <div className="rs-card">
                <h3 className="rs-card-title">Partnerships</h3>
                <p className="rs-card-desc">
                  Bootcamps, universities, recruiting teams — we can discuss a team setup.
                </p>
                <div className="rs-actions" style={{ marginTop: 12 }}>
                  <a className="rs-btn rs-btn-ghost" href="mailto:partners@resumeshortlist.ai">
                    Email partnerships →
                  </a>
                </div>
              </div>

              <div className="rs-card">
                <h3 className="rs-card-title">Feedback</h3>
                <p className="rs-card-desc">
                  Tell us what you expected vs what you saw — that’s how we win the category.
                </p>
                <div className="rs-actions" style={{ marginTop: 12 }}>
                  <a className="rs-btn rs-btn-ghost" href="mailto:feedback@resumeshortlist.ai">
                    Send feedback →
                  </a>
                </div>
              </div>
            </div>

            <div className="rs-divider" />

            <div className="rs-actions">
              <Link href="/app" className="rs-btn rs-btn-primary">
                Try the App
              </Link>
              <Link href="/blog" className="rs-btn rs-btn-ghost">
                Read the blog
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
