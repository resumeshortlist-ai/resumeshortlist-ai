import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ResumeShortList support.",
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="h1">Contact</h1>
        <p className="p">Questions, feedback, or support — reach us here.</p>

        <div className="section sm">
          <div className="grid cols2">
            <div className="card">
              <h2 className="h2">Email</h2>
              <p className="small">info@resumeshortlist.app</p>
              <p className="small">We typically respond within 1–2 business days.</p>
            </div>

            <div className="card">
              <h2 className="h2">Contact form (stub)</h2>
              <form action="#" method="post" onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gap: 10 }}>
                <input className="input" placeholder="Your email" />
                <input className="input" placeholder="Subject" />
                <textarea className="textarea" placeholder="Message" />
                <button className="btn primary" type="submit">Send</button>
                <div className="small">This form is a placeholder — wire it to email or a ticketing tool when ready.</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
