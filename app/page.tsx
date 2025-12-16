import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ResumeShortList.ai — Free ATS Resume Score + One-Click Optimization",
  description:
    "Upload your resume, get a free ATS-style resume score instantly, then optionally pay a one-time fee to optimize it.",
};

export default function HomePage() {
  return (
    <main style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <header style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#111", fontWeight: 800, letterSpacing: "-0.02em" }}>
            ResumeShortList.ai
          </Link>

          <nav style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/free-ats-resume-score" style={{ textDecoration: "none", color: "#111" }}>Free ATS Score</Link>
            <Link href="/how-it-works" style={{ textDecoration: "none", color: "#111" }}>How it works</Link>
            <Link href="/pricing" style={{ textDecoration: "none", color: "#111" }}>Pricing</Link>
            <Link
              href="/app"
              style={{
                textDecoration: "none",
                color: "#fff",
                background: "#111",
                borderRadius: 10,
                padding: "10px 14px",
                border: "1px solid #111",
                fontWeight: 700,
              }}
            >
              Try the App
            </Link>
          </nav>
        </div>
      </header>

      <section style={{ maxWidth: 1040, margin: "0 auto", padding: "56px 20px" }}>
        <h1 style={{ fontSize: 46, lineHeight: 1.05, margin: "0 0 14px", letterSpacing: "-0.03em" }}>
          Free ATS Resume Score — then optimize with a one-time checkout
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, margin: "0 0 22px", color: "#374151", maxWidth: 760 }}>
          Upload your resume and get an instant, ATS-style score for free. If you want, pay once to get an optimized version
          (clean formatting, tighter bullets, keyword alignment).
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          <Link
            href="/app"
            style={{
              textDecoration: "none",
              color: "#fff",
              background: "#111",
              borderRadius: 12,
              padding: "12px 16px",
              border: "1px solid #111",
              fontWeight: 800,
            }}
          >
            Upload & Get Free Score
          </Link>
          <Link
            href="/pricing"
            style={{
              textDecoration: "none",
              color: "#111",
              background: "#fff",
              borderRadius: 12,
              padding: "12px 16px",
              border: "1px solid #e5e7eb",
              fontWeight: 700,
            }}
          >
            See pricing
          </Link>
        </div>

        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {[
            { t: "Free score first", d: "Instant ATS-style score + quick fixes before you pay anything." },
            { t: "One-time optimization", d: "Pay once to generate an improved resume version (no subscription trap)." },
            { t: "Built for speed", d: "Fast upload + clear output: what’s wrong, what to fix, and what improves score." },
            { t: "SEO-first content", d: "Role pages + keyword hubs drive organic traffic over time." },
          ].map((x) => (
            <div key={x.t} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{x.t}</div>
              <div style={{ color: "#374151", lineHeight: 1.55 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "18px 20px", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ color: "#6b7280" }}>© {new Date().getFullYear()} ResumeShortList.ai</div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/privacy" style={{ textDecoration: "none", color: "#6b7280" }}>Privacy</Link>
            <Link href="/terms" style={{ textDecoration: "none", color: "#6b7280" }}>Terms</Link>
            <Link href="/contact" style={{ textDecoration: "none", color: "#6b7280" }}>Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
