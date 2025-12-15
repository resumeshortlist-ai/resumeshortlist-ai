"use client";

import React, { useState } from "react";

export default function AppPage() {
  const [email, setEmail] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  async function handleCheckout() {
    try {
      setStatus("Starting checkout...");

      // Optional: you can enforce resume upload before checkout
      // if (!resumeFile) {
      //   setStatus("Please upload a resume first.");
      //   return;
      // }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || undefined,
          // We’re not uploading the file here yet—this is just a starter page.
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Checkout failed");
      }

      const data = (await res.json()) as { url?: string };

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setStatus("Checkout endpoint responded, but no redirect URL was returned.");
    } catch (err: any) {
      setStatus(`Error: ${err?.message || "Unknown error"}`);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: "0 16px", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>ResumeShortList.ai — App</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        Upload your resume and continue to checkout.
      </p>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginTop: 20 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Email (optional)
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", marginBottom: 16 }}
        />

        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Resume (PDF/DOCX) — optional for now
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
        />
        {resumeFile && (
          <p style={{ marginTop: 10, color: "#333" }}>
            Selected: <strong>{resumeFile.name}</strong>
          </p>
        )}

        <button
          onClick={handleCheckout}
          style={{
            marginTop: 18,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111",
            background: "#111",
            color: "white",
            cursor: "pointer",
          }}
        >
          Continue to Checkout
        </button>

        {status && (
          <p style={{ marginTop: 14, color: status.startsWith("Error") ? "#b00020" : "#333" }}>
            {status}
          </p>
        )}
      </div>

      <p style={{ marginTop: 20 }}>
        <a href="/" style={{ color: "#0b5fff" }}>← Back to home</a>
      </p>
    </main>
  );
}
