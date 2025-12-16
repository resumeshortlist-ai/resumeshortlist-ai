// app/app/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/accessToken";
import CheckoutClient from "./CheckoutClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function AppPage() {
  const token = cookies().get("rsl_access")?.value || "";
  const payload = token ? verifyAccessToken(token) : null;
  const unlocked = Boolean(payload);

  return (
    <main style={{ maxWidth: 900, margin: "80px auto", padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ fontSize: 40, marginBottom: 6 }}>ResumeShortlist — App</h1>
      <p style={{ fontSize: 16, marginBottom: 24, color: "#6b7280" }}>
        {unlocked ? "Access unlocked. Upload your resume below." : "Purchase to unlock the resume optimizer."}
      </p>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
        {unlocked ? (
          <>
            <div style={{ marginBottom: 14 }}>
              <span style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid #10b981", color: "#065f46", background: "#ecfdf5", fontWeight: 700 }}>
                Unlocked ✅
              </span>
              <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                {payload?.email ? <>Signed for: <code>{payload.email}</code></> : <>Access granted</>}
              </div>
            </div>

            {/* Upload placeholder (we'll wire /api/resume/upload next) */}
            <form action="/api/resume/upload" method="post" encType="multipart/form-data" style={{ display: "grid", gap: 10 }}>
              <label style={{ fontWeight: 700 }}>Resume (PDF/DOCX)</label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                required
                style={{ width: "100%", padding: 10, border: "1px solid #e5e7eb", borderRadius: 10 }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid #111",
                  background: "#111",
                  color: "#fff",
                  cursor: "pointer",
                  width: "fit-content",
                  fontWeight: 700,
                }}
              >
                Upload resume →
              </button>
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                Next step: we’ll store the file + email confirmation.
              </div>
            </form>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <span style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid #f59e0b", color: "#92400e", background: "#fffbeb", fontWeight: 700 }}>
                Locked 🔒
              </span>
            </div>

            <CheckoutClient />

            <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
              After payment, you’ll land on the success page — click <b>Continue to your upload →</b> to unlock access.
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <Link href="/">← Back to home</Link>
      </div>
    </main>
  );
}
