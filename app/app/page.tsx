"use client";

import { useState } from "react";

export default function AppPage() {
  const [email, setEmail] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  async function onCheckout() {
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined, fileName: fileName || undefined })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch (e: any) {
      setErr(e?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "80px auto", padding: 24 }}>
      <h1 style={{ fontSize: 40, marginBottom: 6 }}>ResumeShortList.ai — App</h1>
      <p style={{ fontSize: 16, marginBottom: 24 }}>
        Upload your resume and continue to checkout.
      </p>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Email (optional)
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{ width: "100%", padding: 10, marginBottom: 16 }}
        />

        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Resume (PDF/DOCX) — optional for now
        </label>
        <input
          type="file"
          onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          style={{ marginBottom: 14 }}
        />
        {fileName ? <div style={{ marginBottom: 18 }}>Selected: <b>{fileName}</b></div> : null}

        <button
          onClick={onCheckout}
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          {loading ? "Starting Checkout..." : "Continue to Checkout"}
        </button>

        {err ? <div style={{ color: "crimson", marginTop: 12 }}>Error: {err}</div> : null}
      </div>

      <div style={{ marginTop: 20 }}>
        <a href="/">← Back to home</a>
      </div>
    </main>
  );
}
