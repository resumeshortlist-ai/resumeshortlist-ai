import type { Metadata } from "next";
import { getPost, POSTS } from "../../../../lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` }
  };
}

function renderContent(content: string) {
  // Tiny markdown-ish renderer for MVP
  const lines = content.trim().split("\n");
  const out: JSX.Element[] = [];
  let key = 0;
  for (const line of lines) {
    const l = line.trim();
    if (!l) continue;
    if (l.startsWith("## ")) {
      out.push(<h2 key={key++} className="h2" style={{ marginTop: 18 }}>{l.replace(/^##\s+/, "")}</h2>);
    } else if (l.startsWith("- ")) {
      // group bullets
      const items: string[] = [l.replace(/^-\s+/, "")];
      // handled in loop? keep simple: single item as li
      out.push(
        <ul key={key++} className="ul">
          <li className="li">{items[0]}</li>
        </ul>
      );
    } else {
      out.push(<p key={key++} className="p" style={{ fontSize: 18 }}>{l}</p>);
    }
  }
  return out;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="h1">Not found</h1>
          <p className="p">This post doesn’t exist.</p>
          <a href="/blog" className="btn ghost">Back to blog</a>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <a href="/blog" className="small">← Back to blog</a>
        <h1 className="h1" style={{ marginTop: 12 }}>{post.title}</h1>
        <div className="small">{new Date(post.dateISO).toLocaleDateString("en-CA")}</div>

        <div className="section sm">
          <div className="card">
            {renderContent(post.content)}
          </div>
        </div>

        <div className="card">
          <h2 className="h2">Get your score</h2>
          <p className="p">Upload your resume and get actionable fixes in minutes.</p>
          <div className="heroCtas">
            <a href="/app" className="btn primary">Get Free Score →</a>
            <a href="/methodology" className="btn ghost">Methodology</a>
          </div>
        </div>
      </div>
    </main>
  );
}
