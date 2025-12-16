// app/success/page.tsx
import Link from "next/link";

export default function SuccessPage({
  searchParams
}: {
  searchParams?: { session_id?: string };
}) {
  const sessionId = searchParams?.session_id;

  return (
    <main style={{ maxWidth: 860, margin: "60px auto", padding: "0 20px", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ fontSize: 44, marginBottom: 10 }}>Payment successful ✅</h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 0 }}>
        Thanks — your purchase is confirmed.
      </p>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginTop: 20 }}>
        <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>What happens next</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>If you uploaded a resume, we’ll email your results to you.</li>
          <li>If you didn’t upload one yet, go back and upload anytime.</li>
        </ul>

        {sessionId ? (
          <p style={{ marginTop: 12, color: "#6b7280", fontSize: 14 }}>
            Checkout session: <code>{sessionId}</code>
          </p>
        ) : null}
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/app" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111", textDecoration: "none" }}>
          Back to Upload
        </Link>
        <Link href="/" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", textDecoration: "none" }}>
          Home
        </Link>
      </div>
    </main>
  );
}
