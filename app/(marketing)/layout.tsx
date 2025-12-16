import type { Metadata } from "next";
import TrackedLink from "./tracked-link";

export const metadata: Metadata = {
  title: "ResumeShortList — Free ATS Resume Score + One‑Time Optimization",
  description:
    "Get an explainable ATS resume score for free. Pay once to unlock optimization + ATS‑safe export.",
};

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="small" style={{ color: "var(--muted)" }}>
      {label}
    </a>
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="nav">
        <div className="container">
          <div className="navRow">
            <a href="/" className="brand" aria-label="ResumeShortList home">
              <span className="logo" aria-hidden />
              <span>ResumeShortList</span>
            </a>

            <nav className="navLinks" aria-label="Primary navigation">
              <NavLink href="/free-ats-resume-score" label="Free ATS Score" />
              <NavLink href="/how-it-works" label="How it works" />
              <NavLink href="/pricing" label="Pricing" />
              <NavLink href="/methodology" label="Methodology" />
              <NavLink href="/blog" label="Blog" />
              <TrackedLink href="/app" className="btn small primary" event="nav_get_score_click">
                Get Free Score →
              </TrackedLink>
            </nav>
          </div>
        </div>
      </header>

      {children}

      <footer className="footer">
        <div className="container">
          <div className="footerGrid">
            <div>
              <div className="brand" style={{ marginBottom: 8 }}>
                <span className="logo" aria-hidden />
                <span>ResumeShortList</span>
              </div>
              <div className="small">
                Free ATS resume scoring with transparent methodology. One‑time optimization to export ATS‑safe files.
              </div>
              <div className="small" style={{ marginTop: 10 }}>
                © {new Date().getFullYear()} ResumeShortList. All rights reserved.
              </div>
            </div>

            <div>
              <div className="h3">Product</div>
              <div className="small" style={{ display: "grid", gap: 8 }}>
                <a href="/free-ats-resume-score">Free ATS Score</a>
                <a href="/pricing">Pricing</a>
                <a href="/methodology">Score Methodology</a>
                <a href="/how-it-works">How it works</a>
              </div>
            </div>

            <div>
              <div className="h3">Company</div>
              <div className="small" style={{ display: "grid", gap: 8 }}>
                <a href="/contact">Contact</a>
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
              </div>
            </div>
          </div>

          <div className="hr" style={{ marginTop: 22 }} />
          <div className="small" style={{ marginTop: 14 }}>
            Disclaimer: Resume scoring is heuristic and depends on role, seniority, and job requirements. Always tailor before applying.
          </div>
        </div>
      </footer>
    </>
  );
}
