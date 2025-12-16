import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ResumeShortList.ai — Free ATS Resume Score + One-Time Optimization",
  description:
    "Upload your resume, get a free ATS-style score instantly, then optionally pay a one-time fee to optimize it.",
};

export default function HomePage() {
  return (
    <main className="rs-root">
      {/* Background */}
      <div className="rs-bg" aria-hidden="true" />
      <div className="rs-bg2" aria-hidden="true" />
      <div className="rs-grid" aria-hidden="true" />

      {/* Top Nav */}
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
              Try the App <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="rs-hero">
        <div className="rs-container">
          <div className="rs-hero-card">
            <div className="rs-pillrow">
              <span className="rs-pill">⚡ Instant score</span>
              <span className="rs-pill">✅ ATS-style checks</span>
              <span className="rs-pill">💳 One-time upgrade</span>
            </div>

            <h1 className="rs-h1">
              Free ATS Resume Score <span className="rs-dash">—</span>{" "}
              <span className="rs-h1-soft">then optimize with a one-time checkout</span>
            </h1>

            <p className="rs-sub">
              Upload your resume and get an instant, ATS-style score for free.
              If you want, upgrade once to generate an optimized version
              (clean formatting, tighter bullets, keyword alignment).
            </p>

            <div className="rs-actions">
              <Link href="/app" className="rs-btn rs-btn-primary">
                Upload & Get Free Score
              </Link>
              <Link href="/pricing" className="rs-btn rs-btn-ghost">
                See pricing
              </Link>
            </div>

            <div className="rs-micro">
              <div className="rs-micro-item">
                <div className="rs-micro-kpi">60 sec</div>
                <div className="rs-micro-label">Typical score time</div>
              </div>
              <div className="rs-micro-item">
                <div className="rs-micro-kpi">No signup</div>
                <div className="rs-micro-label">for your first score</div>
              </div>
              <div className="rs-micro-item">
                <div className="rs-micro-kpi">One-time</div>
                <div className="rs-micro-label">optimization purchase</div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="rs-grid2">
            {[
              {
                t: "Free score first",
                d: "Get a clear baseline score and quick fixes before paying anything.",
                i: "📊",
              },
              {
                t: "One-time optimization",
                d: "Upgrade once to generate a cleaner, sharper, more ATS-aligned resume.",
                i: "✨",
              },
              {
                t: "Built for speed",
                d: "Fast upload + actionable output: what’s wrong, how to fix it, what changes.",
                i: "⚙️",
              },
              {
                t: "SEO-first content",
                d: "Role pages + keyword hubs designed to capture organic demand over time.",
                i: "🔎",
              },
              {
                t: "Professional-grade output",
                d: "Executive tone, tighter bullets, stronger impact language and structure.",
                i: "🏁",
              },
              {
                t: "Privacy-minded",
                d: "Use short-lived links and clear policies (no surprise data sharing).",
                i: "🔐",
              },
            ].map((x) => (
              <div className="rs-card" key={x.t}>
                <div className="rs-card-top">
                  <div className="rs-icon" aria-hidden="true">
                    {x.i}
                  </div>
                  <div className="rs-card-title">{x.t}</div>
                </div>
                <div className="rs-card-desc">{x.d}</div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="rs-how">
            <div className="rs-how-left">
              <h2 className="rs-h2">How it works</h2>
              <p className="rs-how-sub">
                A simple flow that converts: free value first, then a clear upgrade path.
              </p>

              <ol className="rs-steps">
                <li className="rs-step">
                  <div className="rs-step-num">1</div>
                  <div>
                    <div className="rs-step-title">Upload resume (PDF / DOCX)</div>
                    <div className="rs-step-desc">No account needed to see your first score.</div>
                  </div>
                </li>
                <li className="rs-step">
                  <div className="rs-step-num">2</div>
                  <div>
                    <div className="rs-step-title">Get your free ATS-style score</div>
                    <div className="rs-step-desc">See what’s blocking you from interviews.</div>
                  </div>
                </li>
                <li className="rs-step">
                  <div className="rs-step-num">3</div>
                  <div>
                    <div className="rs-step-title">Upgrade once to optimize</div>
                    <div className="rs-step-desc">Generate an improved resume version + next-step guidance.</div>
                  </div>
                </li>
              </ol>

              <div className="rs-how-actions">
                <Link href="/app" className="rs-btn rs-btn-primary">
                  Try it now <span aria-hidden="true">→</span>
                </Link>
                <Link href="/how-it-works" className="rs-btn rs-btn-ghost">
                  Learn more
                </Link>
              </div>
            </div>

            <div className="rs-how-right">
              <div className="rs-mock">
                <div className="rs-mock-top">
                  <div className="rs-dot rs-dot-r" />
                  <div className="rs-dot rs-dot-y" />
                  <div className="rs-dot rs-dot-g" />
                  <div className="rs-mock-title">ATS Score Preview</div>
                </div>

                <div className="rs-mock-body">
                  <div className="rs-score">
                    <div className="rs-score-ring" aria-hidden="true">
                      <div className="rs-score-ring-inner">78</div>
                    </div>
                    <div>
                      <div className="rs-score-title">Score: 78 / 100</div>
                      <div className="rs-score-sub">Good — a few changes can push you into “excellent”.</div>
                    </div>
                  </div>

                  <div className="rs-list">
                    {[
                      { k: "Formatting", v: "Strong", s: "good" },
                      { k: "Keywords", v: "Needs improvement", s: "warn" },
                      { k: "Impact bullets", v: "Medium", s: "mid" },
                      { k: "ATS readability", v: "Strong", s: "good" },
                    ].map((row) => (
                      <div className="rs-row" key={row.k}>
                        <div className="rs-row-left">{row.k}</div>
                        <div className={`rs-badge rs-badge-${row.s}`}>{row.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rs-note">
                    Tip: add 6–10 role-specific keywords and quantify 2–3 bullets to jump 10+ points.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="rs-footer">
            <div className="rs-footer-inner">
              <div className="rs-foot-left">© {new Date().getFullYear()} ResumeShortList.ai</div>
              <div className="rs-foot-right">
                <Link href="/privacy" className="rs-footlink">
                  Privacy
                </Link>
                <Link href="/terms" className="rs-footlink">
                  Terms
                </Link>
                <Link href="/contact" className="rs-footlink">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        :root {
          --rs-bg: #070a12;
          --rs-card: rgba(255, 255, 255, 0.06);
          --rs-border: rgba(255, 255, 255, 0.12);
          --rs-text: rgba(255, 255, 255, 0.92);
          --rs-muted: rgba(255, 255, 255, 0.68);
          --rs-faint: rgba(255, 255, 255, 0.5);
          --rs-accent: #7c5cff;
          --rs-accent2: #19d3ff;
          --rs-shadow: 0 18px 55px rgba(0, 0, 0, 0.55);
        }

        .rs-root {
          min-height: 100vh;
          background: var(--rs-bg);
          color: var(--rs-text);
          position: relative;
          overflow: hidden;
        }

        .rs-bg {
          position: absolute;
          inset: -10%;
          background:
            radial-gradient(900px 500px at 20% 18%, rgba(124, 92, 255, 0.35), transparent 60%),
            radial-gradient(700px 420px at 75% 30%, rgba(25, 211, 255, 0.25), transparent 60%),
            radial-gradient(900px 520px at 60% 90%, rgba(124, 92, 255, 0.18), transparent 60%);
          filter: blur(2px);
          opacity: 0.95;
          pointer-events: none;
        }

        .rs-bg2 {
          position: absolute;
          inset: 0;
          background: radial-gradient(800px 360px at 50% 0%, rgba(255, 255, 255, 0.08), transparent 55%);
          pointer-events: none;
        }

        .rs-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.12;
          mask-image: radial-gradient(600px 320px at 50% 20%, rgba(0, 0, 0, 1), transparent 70%);
          pointer-events: none;
        }

        .rs-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .rs-header {
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(10px);
          background: rgba(7, 10, 18, 0.55);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .rs-header-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .rs-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--rs-text);
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .rs-brand-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--rs-accent), var(--rs-accent2));
          box-shadow: 0 0 0 6px rgba(124, 92, 255, 0.14);
        }

        .rs-nav {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .rs-navlink {
          color: var(--rs-muted);
          text-decoration: none;
          font-weight: 650;
          padding: 10px 10px;
          border-radius: 10px;
          transition: all 160ms ease;
        }

        .rs-navlink:hover {
          color: var(--rs-text);
          background: rgba(255, 255, 255, 0.06);
        }

        .rs-cta {
          text-decoration: none;
          color: #0b0d12;
          font-weight: 900;
          border-radius: 12px;
          padding: 10px 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
          transition: transform 150ms ease, box-shadow 150ms ease;
          white-space: nowrap;
        }

        .rs-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.45);
        }

        .rs-hero {
          padding: 52px 0 44px;
          position: relative;
          z-index: 1;
        }

        .rs-hero-card {
          border: 1px solid var(--rs-border);
          border-radius: 22px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
          box-shadow: var(--rs-shadow);
          padding: 34px;
        }

        .rs-pillrow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .rs-pill {
          font-size: 13px;
          font-weight: 750;
          color: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 10px;
          border-radius: 999px;
        }

        .rs-h1 {
          margin: 0;
          font-size: 54px;
          line-height: 1.03;
          letter-spacing: -0.04em;
        }

        .rs-dash {
          color: rgba(255, 255, 255, 0.6);
        }

        .rs-h1-soft {
          color: rgba(255, 255, 255, 0.86);
        }

        .rs-sub {
          margin: 14px 0 0;
          font-size: 18px;
          line-height: 1.65;
          color: var(--rs-muted);
          max-width: 820px;
        }

        .rs-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .rs-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 900;
          letter-spacing: -0.01em;
          transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease;
          border: 1px solid rgba(255, 255, 255, 0.12);
          user-select: none;
        }

        .rs-btn-primary {
          color: #0b0d12;
          background: linear-gradient(135deg, rgba(124, 92, 255, 1), rgba(25, 211, 255, 1));
          border: 0;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.45);
        }

        .rs-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.55);
        }

        .rs-btn-ghost {
          color: var(--rs-text);
          background: rgba(255, 255, 255, 0.04);
        }

        .rs-btn-ghost:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.07);
        }

        .rs-micro {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .rs-micro-item {
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 12px 14px;
        }

        .rs-micro-kpi {
          font-weight: 950;
          letter-spacing: -0.02em;
          font-size: 16px;
        }

        .rs-micro-label {
          margin-top: 3px;
          color: var(--rs-faint);
          font-size: 13px;
          line-height: 1.3;
        }

        .rs-grid2 {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .rs-card {
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 18px;
          padding: 16px;
          transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
        }

        .rs-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.16);
        }

        .rs-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .rs-icon {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.10);
          font-size: 16px;
        }

        .rs-card-title {
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .rs-card-desc {
          color: var(--rs-muted);
          line-height: 1.55;
          font-size: 14.5px;
        }

        .rs-how {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 14px;
          align-items: stretch;
        }

        .rs-how-left,
        .rs-how-right {
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 18px;
          padding: 18px;
        }

        .rs-h2 {
          margin: 0;
          font-size: 22px;
          letter-spacing: -0.02em;
        }

        .rs-how-sub {
          margin: 8px 0 0;
          color: var(--rs-muted);
          line-height: 1.6;
        }

        .rs-steps {
          margin: 14px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 10px;
        }

        .rs-step {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 12px;
        }

        .rs-step-num {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          font-weight: 950;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .rs-step-title {
          font-weight: 900;
          letter-spacing: -0.01em;
        }

        .rs-step-desc {
          margin-top: 2px;
          color: var(--rs-muted);
          line-height: 1.5;
          font-size: 14px;
        }

        .rs-how-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .rs-mock {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(10, 12, 18, 0.65);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .rs-mock-top {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
        }

        .rs-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }
        .rs-dot-r {
          background: #ff5f56;
        }
        .rs-dot-y {
          background: #ffbd2e;
        }
        .rs-dot-g {
          background: #27c93f;
        }

        .rs-mock-title {
          margin-left: 8px;
          font-weight: 850;
          color: rgba(255, 255, 255, 0.82);
          font-size: 13px;
        }

        .rs-mock-body {
          padding: 14px;
        }

        .rs-score {
          display: flex;
          gap: 12px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 12px;
        }

        .rs-score-ring {
          width: 54px;
          height: 54px;
          border-radius: 999px;
          background: conic-gradient(var(--rs-accent2), var(--rs-accent));
          display: grid;
          place-items: center;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
        }

        .rs-score-ring-inner {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: rgba(7, 10, 18, 0.95);
          display: grid;
          place-items: center;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .rs-score-title {
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .rs-score-sub {
          margin-top: 2px;
          color: var(--rs-muted);
          font-size: 13.5px;
          line-height: 1.45;
        }

        .rs-list {
          margin-top: 12px;
          display: grid;
          gap: 8px;
        }

        .rs-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          padding: 10px 12px;
        }

        .rs-row-left {
          color: rgba(255, 255, 255, 0.84);
          font-weight: 700;
          font-size: 13.5px;
        }

        .rs-badge {
          font-size: 12px;
          font-weight: 900;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.10);
        }

        .rs-badge-good {
          background: rgba(39, 201, 63, 0.12);
          color: rgba(255, 255, 255, 0.9);
        }

        .rs-badge-mid {
          background: rgba(255, 189, 46, 0.14);
          color: rgba(255, 255, 255, 0.9);
        }

        .rs-badge-warn {
          background: rgba(255, 95, 86, 0.14);
          color: rgba(255, 255, 255, 0.92);
        }

        .rs-note {
          margin-top: 12px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          line-height: 1.55;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px dashed rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.02);
        }

        .rs-footer {
          margin-top: 22px;
          padding-bottom: 36px;
        }

        .rs-footer-inner {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 16px;
          color: var(--rs-faint);
        }

        .rs-footlink {
          color: var(--rs-faint);
          text-decoration: none;
          font-weight: 700;
          padding: 6px 8px;
          border-radius: 10px;
        }

        .rs-footlink:hover {
          color: var(--rs-text);
          background: rgba(255, 255, 255, 0.06);
        }

        /* Responsive */
        @media (max-width: 980px) {
          .rs-h1 {
            font-size: 44px;
          }
          .rs-grid2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .rs-how {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .rs-h1 {
            font-size: 38px;
          }
          .rs-hero-card {
            padding: 20px;
          }
          .rs-grid2 {
            grid-template-columns: 1fr;
          }
          .rs-micro {
            grid-template-columns: 1fr;
          }
          .rs-nav {
            gap: 8px;
          }
          .rs-navlink {
            padding: 8px 8px;
          }
        }
      `}</style>
    </main>
  );
}
