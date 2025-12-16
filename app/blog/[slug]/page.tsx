import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "../../../lib/blog";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post not found — ResumeShortList.ai" };

  return {
    title: `${post.title} — ResumeShortList.ai`,
    description: post.description
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <main className="rs-root">
      <div className="rs-bg" aria-hidden="true" />
      <div className="rs-bg2" aria-hidden="true" />
      <div className="rs-grid" aria-hidden="true" />
      <div className="rs-vignette" aria-hidden="true" />

      <header className="rs-header">
        <div className="rs-header-inner">
          <Link href="/" className="rs-brand">
            <span className="rs-brand-dot" aria-hidden="true" />
            <span>ResumeShortList.ai</span>
          </Link>

          <nav className="rs-nav" aria-label="Primary">
            <Link href="/free-ats-resume-score" className="rs-navlink">
              Free ATS Score
            </Link>
            <Link href="/how-it-works" className="rs-navlink">
              How it works
            </Link>
            <Link href="/pricing" className="rs-navlink">
              Pricing
            </Link>
            <Link href="/app" className="rs-cta">
              Try the App →
            </Link>
          </nav>
        </div>
      </header>

      <section className="rs-section">
        <div className="rs-container">
          <div className="rs-surface">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <div>
                <h1 className="rs-h1" style={{ fontSize: 40 }}>
                  {post.title}
                </h1>
                <p className="rs-sub" style={{ marginTop: 10 }}>
                  {post.description}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ color: "rgba(255,255,255,0.6)", fontWeight: 800, fontSize: 13 }}>
                  {post.date} • {post.readingMins} min read
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: "rgba(255,255,255,0.78)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.05)",
                        padding: "6px 10px",
                        borderRadius: 999
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rs-divider" />

            <article style={{ maxWidth: 860 }}>
              {post.sections.map((s, idx) => (
                <section key={idx} style={{ marginBottom: 18 }}>
                  {s.heading ? (
                    <h2 className="rs-h2" style={{ marginBottom: 8 }}>
                      {s.heading}
                    </h2>
                  ) : null}

                  {s.paragraphs.map((para, i) => (
                    <p
                      key={i}
                      style={{
                        margin: "0 0 10px",
                        lineHeight: 1.75,
                        color: "rgba(255,255,255,0.78)",
                        fontWeight: 650,
                        fontSize: 15.5
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </section>
              ))}
            </article>

            <div className="rs-divider" />

            <div className="rs-actions">
              <Link href="/app" className="rs-btn rs-btn-primary">
                Get free score
              </Link>
              <Link href="/blog" className="rs-btn rs-btn-ghost">
                ← Back to blog
              </Link>
            </div>
          </div>

          <footer className="rs-footer">
            <div className="rs-footer-inner">
              <div>© {new Date().getFullYear()} ResumeShortList.ai</div>
              <div>
                <Link className="rs-footlink" href="/privacy">
                  Privacy
                </Link>
                <Link className="rs-footlink" href="/terms">
                  Terms
                </Link>
                <Link className="rs-footlink" href="/contact">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
