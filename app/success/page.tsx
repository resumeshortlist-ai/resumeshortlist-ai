// app/success/page.tsx
import Link from "next/link";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

export default async function SuccessPage({
  searchParams,
}: {
  searchParams?: { session_id?: string };
}) {
  const sessionId = searchParams?.session_id;

  if (!stripe) {
    return (
      <main style={styles.main}>
        <h1 style={styles.h1}>Not configured</h1>
        <p style={styles.p}>
          Missing <code>STRIPE_SECRET_KEY</code> environment variable.
        </p>
        <div style={styles.actions}>
          <Link href="/app" style={styles.primaryBtn}>
            Back to Upload
          </Link>
          <Link href="/" style={styles.secondaryBtn}>
            Home
          </Link>
        </div>
      </main>
    );
  }

  if (!sessionId) {
    return (
      <main style={styles.main}>
        <h1 style={styles.h1}>Missing session</h1>
        <p style={styles.p}>
          We couldn’t find a Stripe session ID. Please return and try checkout
          again.
        </p>
        <div style={styles.actions}>
          <Link href="/app" style={styles.primaryBtn}>
            Back to Upload
          </Link>
          <Link href="/" style={styles.secondaryBtn}>
            Home
          </Link>
        </div>
      </main>
    );
  }

  let paid = false;
  let customerEmail: string | null = null;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paid = session.payment_status === "paid";
    customerEmail =
      session.customer_details?.email ?? session.customer_email ?? null;
  } catch {
    paid = false;
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>
        {paid ? "Payment successful ✅" : "Payment not confirmed ⚠️"}
      </h1>

      <p style={styles.p}>
        {paid
          ? "Thanks — your purchase is confirmed."
          : "We couldn’t confirm payment for this session yet. If you believe this is a mistake, try again or contact support."}
      </p>

      <div style={styles.card}>
        <h2 style={styles.h2}>What happens next</h2>
        <ul style={styles.ul}>
          <li>If you uploaded a resume, we’ll email your results to you.</li>
          <li>If you didn’t upload one yet, go back and upload anytime.</li>
        </ul>

        {customerEmail ? (
          <p style={styles.meta}>
            Email: <code>{customerEmail}</code>
          </p>
        ) : null}

        <p style={styles.meta}>
          Checkout session: <code>{sessionId}</code>
        </p>

        {paid ? (
          <form action="/api/access/issue" method="post" style={{ marginTop: 16 }}>
            <input type="hidden" name="session_id" value={sessionId} />
            <button type="submit" style={styles.ctaBtn}>
              Continue to your upload →
            </button>
          </form>
        ) : null}
      </div>

      <div style={styles.actions}>
        <Link href="/app" style={styles.primaryBtn}>
          Back to Upload
        </Link>
        <Link href="/" style={styles.secondaryBtn}>
          Home
        </Link>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 860,
    margin: "60px auto",
    padding: "0 20px",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  h1: { fontSize: 44, marginBottom: 10 },
  h2: { fontSize: 18, margin: "0 0 8px" },
  p: { fontSize: 18, lineHeight: 1.6, marginTop: 0 },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  ul: { margin: 0, paddingLeft: 18, lineHeight: 1.7 },
  meta: { marginTop: 12, color: "#6b7280", fontSize: 14 },
  actions: { marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" },
  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #111",
    textDecoration: "none",
    color: "#111",
  },
  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    textDecoration: "none",
    color: "#111",
  },
  ctaBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #111",
    cursor: "pointer",
    background: "#111",
    color: "#fff",
    fontWeight: 600,
  },
};
