// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "72px 20px",
        fontFamily:
          'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      <div
        style={{
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 20,
          padding: 28,
          background: "white",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, letterSpacing: "-0.02em", fontSize: 18 }}>
              ResumeShortList.ai
            </div>
            <h1 style={{ fontSize: 46, lineHeight: 1.05, margin: "12px 0 10px" }}>
              Free ATS Resume Score — then optimize with a one-time checkout
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, margin: 0, color: "rgba(0,0,0,0.7)" }}>
              Upload your resume and get an instant, ATS-style score for free. If you want, pay once to
              get an optimized version (clean formatting, tighter bullets, keyword alignment).
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
              <Link
                href="/app"
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  borderRadius: 12,
                  textDecoration: "none",
                  border: "1px solid #111",
                  background: "#111",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Upload & Get Free Score
              </Link>

              <Link
                href="/pricing"
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  borderRadius: 12,
                  textDecoration: "none",
                  border: "1px solid rgba(0,0,0,0.12)",
                  color: "#111",
                  fontWeight: 600,
                }}
              >
                See pricing
              </Link>
            </div>
          </div>

          <div
            style={{
              minWidth: 280,
              flex: "0 1 320px",
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: 16,
              background: "rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>What you get</div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75 }}>
              <li>Free resume score + quick fixes</li>
              <li>One-time optimization (no subscription trap)</li>
              <li>Role-aligned keyword guidance</li>
              <li>Clear “what to fix” output</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Link href="/how-it-works">How it works</Link>
        <span style={{ opacity: 0.35 }}>•</span>
        <Link href="/free-ats-resume-score">Free ATS score</Link>
        <span style={{ opacity: 0.35 }}>•</span>
        <Link href="/blog">Blog</Link>
        <span style={{ opacity: 0.35 }}>•</span>
        <Link href="/contact">Contact</Link>
      </div>
    </main>
  );
}
