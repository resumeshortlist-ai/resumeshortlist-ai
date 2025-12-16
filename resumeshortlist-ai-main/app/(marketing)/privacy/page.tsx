import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for ResumeShortList.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="h1">Privacy Policy</h1>
        <p className="p">Plain-English summary for MVP (replace with legal text when you’re ready).</p>

        <div className="section sm">
          <div className="card">
            <h2 className="h2">What we collect</h2>
            <ul className="ul">
              <li className="li">Resume files you upload (PDF/DOCX)</li>
              <li className="li">Optional email address</li>
              <li className="li">Basic usage analytics (if enabled)</li>
            </ul>

            <h2 className="h2" style={{ marginTop: 18 }}>How we use it</h2>
            <ul className="ul">
              <li className="li">To generate your score and optimization output</li>
              <li className="li">To support the product and improve quality</li>
            </ul>

            <h2 className="h2" style={{ marginTop: 18 }}>What we don’t do</h2>
            <ul className="ul">
              <li className="li">We don’t sell your personal data</li>
              <li className="li">We don’t publish your resume</li>
            </ul>

            <p className="small" style={{ marginTop: 16 }}>
              MVP note: file storage behavior depends on your hosting/storage provider configuration.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
