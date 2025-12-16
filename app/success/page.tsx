// app/success/page.tsx
import Link from "next/link";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export default async function SuccessPage({
  searchParams,
}: {
  searchParams?: { session_id?: string };
}) {
  const sessionId = searchParams?.session_id;

  if (!sessionId) {
    return (
      <main style={{ maxWidth: 860, margin: "60px auto", padding: "0 20px", fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 44, marginBottom: 10 }}>Missing session</h1>
        <p>We couldn’t find a Stripe session ID.</p>
        <Link href="/app">Back to App</Link>
      </main>
    );
  }

  let paid = false;
  let blobUrl: string | null = null;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paid = session.payment_status === "paid" || session.status === "complete";
    blobUrl = (session.metadata?.blobUrl as string) || null;
  } catch {
    paid = false;
  }

  const continueHref = blobUrl
    ? `/app?session_id=${encodeURIComponent(sessionId)}&blob=${encodeURIComponent(blobUrl)}`
    : `/app?session_id=${encodeURIComponent(sessionId)}`;

  return (
    <main style={{ maxWidth: 860, margin: "60px auto", padding: "0 20px", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 44, marginBottom: 10 }}>
        {paid ? "Payment successful ✅" : "Payment not confirmed ⚠️"}
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 0 }}>
        {paid
          ? "Thanks — your purchase is confirmed. Continue to generate your optimized output."
          : "We couldn’t confirm payment for this session. If you believe this is a mistake, try again or contact support."}
      </p>

      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href={continueHref} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111", textDecoration: "none" }}>
          Continue to App
        </Link>
        <Link href="/" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", textDecoration: "none" }}>
          Home
        </Link>
      </div>

      <p style={{ marginTop: 16, color: "#6b7280", fontSize: 14 }}>
        Checkout session: <code>{sessionId}</code>
      </p>
    </main>
  );
}
