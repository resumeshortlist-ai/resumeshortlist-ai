import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "../../lib/blog";

export const metadata: Metadata = {
  title: "ResumeShortList — Free ATS Resume Score",
  description:
    "Upload your resume and get a free ATS score + top fixes. Pay once to unlock optimization and ATS-safe export.",
};

export default function MarketingHome() {
  const latest = POSTS.slice(0, 3);

  return (
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: "64px 20px", fontFamily: "system-ui" }}>
      <section style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 52, lineHeight: 1.05, margin: 0 }}>
          Free ATS Resume Score in <span style={{ whiteSpace: "nowrap" }}>60 seconds</span>
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 16, maxWidth: 780 }}>
          Upload your resume, get a clear score breakdown, and see the highest-impact fixes. If you want the optimized
          version, unlock it with a one-time payment — no subscriptions.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <Link
            href="/app"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Get Free Score
          </Link>
          <Link
            href="/methodology"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              textDecoration: "none",
              fontWeight: 600,
              color: "#111",
            }}
          >
            How scoring works
          </Link>
          <Link
            href="/pricing"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              textDecoration: "none",
              fontWeight: 600,
              color: "#111",
            }}
          >
            Pricing
          </Link>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 48 }}>
        {[
          { title: "Explainable scoring", body: "See exactly what helps or hurts your ATS score—no black box." },
          { title: "ATS-safe formatting", body: "We prioritize parsing accuracy: clean structure, headings, and bullets." },
          { title: "One-time unlock", body: "Get a free score. Pay once to unlock optimization + export." },
          { title: "Role-fit improvements", body: "Optional tailoring: keyword coverage + placement you can validate." },
        ].map((c) => (
          <div key={c.title} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>{c.title}</h3>
            <p style={{ marginTop: 8, marginBottom: 0, color: "#4b5563", lineHeight: 1.6 }}>{c.body}</p>
          </div>
        ))}
      </section>

      <section style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Latest guides</h2>
          <Link href="/blog" style={{ textDecoration: "none", fontWeight: 600 }}>
            View all →
          </Link>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {latest.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              style={{ padding: 12, borderRadius: 12, border: "1px solid #f3f4f6", textDecoration: "none" }}
            >
              <div style={{ fontWeight: 700 }}>{p.title}</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>{p.excerpt}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
