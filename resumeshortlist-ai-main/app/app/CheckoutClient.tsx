"use client";

import { useState } from "react";

export default function CheckoutClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  async function onCheckout() {
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      window.location.href = data.url;
    } catch (e: any) {
      setErr(e?.message || "Checkout failed");
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  return (
    <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
      <label style={{ fontWeight: 700 }}>Email (recommended)</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        type="email"
        style={{ width: "100%", padding: 10, border: "1px solid #e5e7eb", borderRadius: 10 }}
      />

      <button
        onClick={onCheckout}
        disabled={loading}
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "1px solid #111",
          background: "#111",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          width: "fit-content",
          fontWeight: 700,
        }}
      >
        {loading ? "Starting Checkout..." : "Continue to Checkout"}
      </button>

      {err ? <div style={{ color: "crimson" }}>Error: {err}</div> : null}
    </div>
  );
}
