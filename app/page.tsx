// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 900, margin: "80px auto", padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ fontSize: 44, marginBottom: 10 }}>ResumeShortlist</h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: "#6b7280", marginTop: 0 }}>
        Upload your resume, improve ATS alignment, and get a cleaner, stronger version fast.
      </p>

      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          href="/app"
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Go to App →
        </Link>

        <a
          href="mailto:info@resumeshortlist.app"
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            color: "#111",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Contact
        </a>
      </div>
    </main>
  );
}
