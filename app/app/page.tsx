"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { upload } from "@vercel/blob/client";

export default function AppPage() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id") || "";

  const inputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const canUpload = useMemo(() => Boolean(sessionId), [sessionId]);

  function getSafeUploadName(file: File) {
    const original = file.name.toLowerCase();
    const ext = original.endsWith(".pdf") ? "pdf" : original.endsWith(".docx") ? "docx" : "";
    return ext ? `resume.${ext}` : "resume";
  }

  async function onUpload() {
    setStatus("");
    setBlobUrl("");

    if (!canUpload) {
      setStatus("Missing session_id — please complete checkout first.");
      return;
    }

    const file = inputRef.current?.files?.[0];
    if (!file) {
      setStatus("Please choose a PDF or DOCX file.");
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isDocx =
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isPdf && !isDocx) {
      setStatus("Only PDF or DOCX is allowed.");
      return;
    }

    setLoading(true);
    try {
      const safeName = getSafeUploadName(file);

      const blob = await upload(safeName, file, {
        access: "public",
        handleUploadUrl: "/api/resume/upload",
        clientPayload: JSON.stringify({ sessionId, email: email || undefined }),
      });

      setBlobUrl(blob.url);
      setStatus("Uploaded ✅");
    } catch (e: any) {
      setStatus(e?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "80px auto", padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ fontSize: 40, marginBottom: 6 }}>ResumeShortList.app — Upload</h1>

      {!canUpload ? (
        <div style={{ padding: 14, border: "1px solid #f59e0b", borderRadius: 12, background: "#fffbeb", marginBottom: 18 }}>
          <b>Payment required.</b> Please complete checkout first, then come back to this page from the success screen.
        </div>
      ) : (
        <div style={{ padding: 14, border: "1px solid #e5e7eb", borderRadius: 12, background: "#f9fafb", marginBottom: 18 }}>
          Payment session detected ✅ You can upload now.
        </div>
      )}

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Email (optional)</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{ width: "100%", padding: 10, marginBottom: 16 }}
        />

        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Resume (PDF or DOCX)</label>
        <input ref={inputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />

        <div style={{ marginTop: 16 }}>
          <button
            onClick={onUpload}
            disabled={loading || !canUpload}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #111",
              background: loading || !canUpload ? "#999" : "#111",
              color: "#fff",
              cursor: loading || !canUpload ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>

        {status ? <div style={{ marginTop: 14 }}>{status}</div> : null}
        {blobUrl ? (
          <div style={{ marginTop: 10, fontSize: 14 }}>
            Stored at: <a href={blobUrl} target="_blank" rel="noreferrer">{blobUrl}</a>
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: 20 }}>
        <a href="/">← Back to home</a>
      </div>
    </main>
  );
}
