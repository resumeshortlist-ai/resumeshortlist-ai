"use client";

import { useState } from "react";
import Link from "next/link";

export default function HeroEmailCaptureClient() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <div
      style={{
        marginTop: 18,
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        display: "grid",
        gap: 12,
        background: "#fff",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16 }}>Get your free ATS score</div>
      <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.5 }}>
        Enter an email to save your result (optional). You can also skip and start immediately.
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com (optional)"
          style={{
            flex: "1 1 240px",
            padding: 10,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
          }}
        />
        <Link
          href={email ? `/app?email=${encodeURIComponent(email)}` : "/app"}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Start free score →
        </Link>
      </form>

      {done ? (
        <div style={{ color: "#16a34a", fontSize: 14 }}>
          ✅ Saved locally for now. (Later we’ll wire this to a real lead capture.)
        </div>
      ) : null}
    </div>
  );
}
