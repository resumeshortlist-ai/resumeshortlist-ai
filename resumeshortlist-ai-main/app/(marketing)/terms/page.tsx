import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using ResumeShortList.",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="h1">Terms of Service</h1>
        <p className="p">Plain-English terms for MVP (replace with legal text when ready).</p>

        <div className="section sm">
          <div className="card">
            <h2 className="h2">Service</h2>
            <p className="small">
              ResumeShortList provides resume scoring and optimization suggestions. Results are heuristic and not a guarantee of interviews or employment.
            </p>

            <h2 className="h2" style={{ marginTop: 18 }}>Payments</h2>
            <p className="small">
              Paid features are a one-time unlock unless stated otherwise. Contact support for issues or refunds per your policy.
            </p>

            <h2 className="h2" style={{ marginTop: 18 }}>Acceptable use</h2>
            <ul className="ul">
              <li className="li">Do not upload content you don’t have the rights to use.</li>
              <li className="li">Do not attempt to exploit or abuse the service.</li>
            </ul>

            <h2 className="h2" style={{ marginTop: 18 }}>Limitation of liability</h2>
            <p className="small">
              Use at your own risk. We are not liable for job outcomes. (Replace with formal terms later.)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
