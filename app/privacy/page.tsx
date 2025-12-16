import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — ResumeShortList.ai",
  description: "Privacy policy for ResumeShortList.ai.",
};

export default function PrivacyPage() {
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
            <h1 className="rs-h1">Privacy</h1>
            <p className="rs-sub">
              This is a practical, founder-friendly policy. You can tighten legal language later, but this covers
              the essentials cleanly.
            </p>

            <div className="rs-divider" />

            <div className="rs-card" style={{ marginBottom: 12 }}>
              <h3 className="rs-card-title">What we collect</h3>
              <p className="rs-card-desc">
                If you upload a resume, we store the uploaded file (via Vercel Blob) and basic metadata like filename
                and content type. If you provide an email, we store that email address.
              </p>
            </div>

            <div className="rs-card" style={{ marginBottom: 12 }}>
              <h3 className="rs-card-title">How we use it</h3>
              <p className="rs-card-desc">
                We use your resume to generate your ATS-style score and (if you pay) your optimized output. We may use
                aggregated, non-identifying information to improve product quality (e.g., common formatting issues).
              </p>
            </div>

            <div className="rs-card" style={{ marginBottom: 12 }}>
              <h3 className="rs-card-title">Payments</h3>
              <p className="rs-card-desc">
                Payments are processed by Stripe. We do not store full payment card details on our servers.
              </p>
            </div>

            <div className="rs-card" style={{ marginBottom: 12 }}>
              <h3 className="rs-card-title">Data retention</h3>
              <p className="rs-card-desc">
                You can request deletion. If you want a strict retention window (e.g., auto-delete after 30 days),
                we can implement that next.
              </p>
            </div>

            <div className="rs-card">
              <h3 className="rs-card-title">Contact</h3>
              <p className="rs-card-desc">
                Questions or deletion requests:{" "}
                <a href="mailto:privacy@resumeshortlist.ai" style={{ color: "rgba(255,255,255,0.92)" }}>
                  privacy@resumeshortlist.ai
                </a>
              </p>
            </div>

            <div className="rs-actions" style={{ marginTop: 18 }}>
              <Link href="/app" className="rs-btn rs-btn-primary">
                Try the App
              </Link>
              <Link href="/terms" className="rs-btn rs-btn-ghost">
                Terms →
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
