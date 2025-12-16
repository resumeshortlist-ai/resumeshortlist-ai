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
    title: `${role.title} Resume Examples`,
    description: `ATS-friendly resume examples and bullet templates for ${role.title}.`,
    alternates: { canonical: `/resume-examples/${role.slug}` }
  };
}

export default function RoleExamplesPage({ params }: { params: { role: string } }) {
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
          <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--accent)" }} />
          Programmatic examples
        </div>
        <h1 className="h1">{role.title} Resume Examples</h1>
        <p className="p">ATS-friendly bullet templates and keywords for this role.</p>

        <div className="section sm">
          <div className="grid cols2">
            <div className="card">
              <h2 className="h2">Example bullets</h2>
              <ul className="ul">
                {role.exampleBullets.map((b, i) => (
                  <li key={i} className="li">{b}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2 className="h2">Top keywords</h2>
              <div className="small" style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop: 8 }}>
                {role.keywords.map((k, i) => (
                  <span key={i} className="badge" style={{ background:"rgba(255,255,255,.03)" }}>{k}</span>
                ))}
              </div>

              <div className="heroCtas" style={{ marginTop: 18 }}>
                <a href="/app" className="btn primary">Get Free Score →</a>
                <a href={`/ats-keywords/${role.slug}`} className="btn ghost">ATS keywords →</a>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="h2">Want personalized fixes?</h2>
          <p className="p">
            Upload your current resume for a free score and role-aligned improvements.
          </p>
          <div className="heroCtas">
            <a href="/app" className="btn primary">Get Free Score →</a>
            <a href="/methodology" className="btn ghost">Methodology</a>
          </div>
        </div>
      </div>
    </main>
  );
}
