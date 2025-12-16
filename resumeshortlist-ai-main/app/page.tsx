import type { Metadata } from "next";
import { POSTS } from "../../../lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "ATS resume tips, formatting guidance, and keyword strategy.",
  alternates: { canonical: "/blog" }
};

export default function BlogPage() {
  const posts = [...POSTS].sort((a,b) => (a.dateISO < b.dateISO ? 1 : -1));

  return (
    <main className="section">
      <div className="container">
        <h1 className="h1">Blog</h1>
        <p className="p">ATS-friendly guidance, keyword strategy, and examples.</p>

        <div className="section sm">
          <div className="grid cols3">
            {posts.map(p => (
              <a key={p.slug} href={`/blog/${p.slug}`} className="card">
                <div className="kicker">{new Date(p.dateISO).toLocaleDateString("en-CA")}</div>
                <div className="h2" style={{ fontSize: 24, marginTop: 8 }}>{p.title}</div>
                <div className="small">{p.excerpt}</div>
                <div style={{ marginTop: 14 }} className="small">Read →</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
