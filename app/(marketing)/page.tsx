import type { Metadata } from "next";
import Link from "next/link";
import HeroEmailCaptureClient from "./HeroEmailCaptureClient";

export const metadata: Metadata = {
  title: "ResumeShortList — Free ATS Resume Score + One-time Optimization",
  description:
    "Upload your resume to get a free ATS score. Pay once to get an optimized, ATS-friendly version.",
};

export default function MarketingHome() {
  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 1060, margin: "0 auto", padding: "28px 20px 70px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: 18, letterSpacing: 0.2, textDecoration: "none", color: "#111" }}>
          ResumeShortList
        </Link>

        <nav style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link href="/pricing" style={{ textDecoration: "none", color: "#111" }}>Pricing</Link>
          <Link href="/how-it-works" style={{ textDecoration: "none", color: "#111" }}>How it works</Link>
          <Link href="/free-ats-resume-score" style={{ textDecoration: "none", color: "#111" }}>Free score</Link>
          <Link href="/contact" style={{ textDecoration: "none", color: "#111" }}>Contact</Link>
          <Link
            href="/app"
            style={{
              textDecoration: "none",
              color: "#fff",
              background: "#111",
              border: "1px solid #111",
              borderRadius: 12,
              padding: "8px 12px",
              fontWeight: 700,
            }}
          >
            Open app →
          </Link>
        </nav>
      </header>

      <section style={{ marginTop: 34 }}>
        <h1 style={{ fontSize: 52, lineHeight: 1.05, margin: "10px 0 12px" }}>
          Free ATS score in minutes.
          <br />
          Pay once to optimize.
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#4b5563", marginTop: 0, maxWidth: 780 }}>
          Upload a PDF or DOCX and get a free score + key fixes. If you want the full rewrite/optimization,
          it’s a one-time purchase (no subscription).
        </p>

        {/* This client component forces the manifest that Vercel is currently failing to trace */}
        <HeroEmailCaptureClient />

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <Link
            href="/app"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Start (free) →
          </Link>

          <Link
            href="/pricing"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              color: "#111",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            See pricing
          </Link>
        </div>
      </section>

      <section style={{ marginTop: 34, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {[
          { title: "ATS score (free)", body: "Get a clear score + the biggest ATS blockers." },
          { title: "One-time optimization", body: "Pay once for a polished, ATS-friendly rewrite." },
          { title: "PDF + DOCX", body: "Upload either format; we’ll guide the next steps." },
          { title: "Fast and simple", body: "No account required to start scoring." },
        ].map((c) => (
          <div key={c.title} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>{c.title}</div>
            <div style={{ color: "#6b7280", lineHeight: 1.55 }}>{c.body}</div>
          </div>
        ))}
      </section>

      <footer style={{ marginTop: 48, paddingTop: 18, borderTop: "1px solid #e5e7eb", color: "#6b7280", fontSize: 14 }}>
        © {new Date().getFullYear()} ResumeShortList • <Link href="/privacy" style={{ color: "#6b7280" }}>Privacy</Link> •{" "}
        <Link href="/terms" style={{ color: "#6b7280" }}>Terms</Link>
      </footer>
    </main>
  );
}
