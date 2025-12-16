// app/cancel/page.tsx
import Link from "next/link";

export default function CancelPage() {
  return (
    <main style={{ maxWidth: 860, margin: "60px auto", padding: "0 20px", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ fontSize: 44, marginBottom: 10 }}>Checkout canceled</h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 0 }}>
        No worries — you weren’t charged. You can try again anytime.
      </p>

      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/app" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111", textDecoration: "none" }}>
          Try Again
        </Link>
        <Link href="/" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", textDecoration: "none" }}>
          Home
        </Link>
      </div>
    </main>
  );
}
