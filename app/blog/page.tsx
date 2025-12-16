import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "../../lib/blog";

export const metadata: Metadata = {
  title: "Blog — ResumeShortList.ai",
  description: "ATS resume scoring, formatting, keyword alignment, and executive bullet writing.",
};

export default function BlogIndexPage() {
  const sorted = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

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
            <h1 className="rs-h1">Blog</h1>
            <p className="rs-sub">
              Practical guidance designed to outperform “template-first” competitors:
              ATS readability, keyword alignment, and bullet writing that wins screens.
            </p>

            <div className="rs-divider" />

            <div className="rs-grid3" style={{ marginTop: 0 }}>
              {sorted.map((p) => (
                <div key={p.slug} className="rs-card">
                  <h3 className="rs-card-title" style={{ marginBottom: 6 }}>
                    {p.title}
                  </h3>
                  <p className="rs-card-desc" style={{ marginBottom: 10 }}>
                    {p.description}
                  </p>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 800 }}>
                      {p.date} • {p.readingMins} min
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 800 }}>
                      {p.tags.slice(0, 2).join(" · ")}
                    </span>
                  </div>

                  <div className="rs-actions" style={{ marginTop: 12 }}>
                    <Link href={`/blog/${p.slug}`} className="rs-btn rs-btn-ghost">
                      Read →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="rs-actions" style={{ marginTop: 18 }}>
              <Link href="/app" className="rs-btn rs-btn-primary">
                Get free score
              </Link>
              <Link href="/pricing" className="rs-btn rs-btn-ghost">
                One-time optimization →
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
