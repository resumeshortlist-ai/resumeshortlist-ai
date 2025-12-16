import type { Metadata } from "next";
import { ROLES, getRoleBySlug } from "../../../../lib/roles";

export const dynamicParams = false;

export function generateStaticParams() {
  return ROLES.map(r => ({ role: r.slug }));
}

export function generateMetadata({ params }: { params: { role: string } }): Metadata {
  const role = getRoleBySlug(params.role);
  if (!role) return { title: "Role not found" };
  return {
    title: `${role.title} ATS Keywords`,
    description: `ATS keyword list and placement guidance for ${role.title}.`,
    alternates: { canonical: `/ats-keywords/${role.slug}` }
  };
}

export default function AtsKeywordsPage({ params }: { params: { role: string } }) {
  const role = getRoleBySlug(params.role);
  if (!role) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="h1">Not found</h1>
          <p className="p">Role page doesn’t exist.</p>
          <a href="/" className="btn ghost">Home</a>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="badge">
          <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--accent2)" }} />
          Keyword strategy
        </div>

        <h1 className="h1">{role.title} ATS Keywords</h1>
        <p className="p">
          Add keywords naturally in <b>Skills</b> and <b>recent experience</b>. Avoid keyword stuffing — prove outcomes.
        </p>

        <div className="section sm">
          <div className="card">
            <h2 className="h2">Keyword list</h2>
            <div className="small" style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop: 8 }}>
              {role.keywords.map((k, i) => (
                <span key={i} className="badge" style={{ background:"rgba(255,255,255,.03)" }}>{k}</span>
              ))}
            </div>

            <h2 className="h2" style={{ marginTop: 18 }}>Where to place them</h2>
            <ul className="ul">
              <li className="li"><b>Skills:</b> list the exact phrase if you have it.</li>
              <li className="li"><b>Experience bullets:</b> show how you used it to drive outcomes.</li>
              <li className="li"><b>Summary:</b> include 2–3 keywords that match your target role.</li>
            </ul>

            <div className="heroCtas" style={{ marginTop: 18 }}>
              <a href="/app" className="btn primary">Get Free Score →</a>
              <a href={`/resume-examples/${role.slug}`} className="btn ghost">Examples →</a>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="h2">Want role-fit tailoring?</h2>
          <p className="p">Paste a job description in the app to get role-aligned suggestions and optimization output.</p>
          <div className="heroCtas">
            <a href="/app" className="btn primary">Open App →</a>
            <a href="/pricing" className="btn ghost">Pricing</a>
          </div>
        </div>
      </div>
    </main>
  );
}
