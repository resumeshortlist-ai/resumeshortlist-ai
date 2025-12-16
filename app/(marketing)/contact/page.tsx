"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    try {
      const form = new FormData(e.currentTarget);
      const name = String(form.get("name") || "");
      const email = String(form.get("email") || "");
      const message = String(form.get("message") || "");

      // For now we just simulate success.
      // Later we can POST to an API route (Resend/SendGrid) to actually email you.
      if (!email || !message) throw new Error("Missing fields");

      setStatus("sent");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <main style={{ maxWidth: 860, margin: "60px auto", padding: "0 20px", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 44, marginBottom: 10 }}>Contact</h1>
      <p style={{ fontSize: 16, color: "#4b5563", marginTop: 0 }}>
        Send us a message and we’ll get back to you.
      </p>

      <form
        onSubmit={onSubmit}
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 16,
          display: "grid",
          gap: 12,
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Name (optional)</span>
          <input name="name" placeholder="Your name" style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Message</span>
          <textarea
            name="message"
            required
            rows={6}
            placeholder="How can we help?"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
          />
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>

        {status === "sent" ? <div style={{ color: "green" }}>✅ Sent! (placeholder)</div> : null}
        {status === "error" ? <div style={{ color: "crimson" }}>❌ Something went wrong. Try again.</div> : null}
      </form>

      <p style={{ marginTop: 16, color: "#6b7280", fontSize: 14 }}>
        Or email: <a href="mailto:info@resumeshortlist.app">info@resumeshortlist.app</a>
      </p>
    </main>
  );
}
