import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ResumeShortList.ai — Free ATS Resume Score + One-Time Optimization",
  description:
    "Upload your resume, get a free ATS-style score instantly, then optionally pay a one-time fee to optimize it.",
};

export default function HomePage() {
  return (
    <main className="rs-root">
      {/* Background */}
      <div className="rs-bg" aria-hidden="true" />
      <div className="rs-bg2" aria-hidden="true" />
      <div className="rs-grid" aria-hidden="true" />
      <div className="rs-vignette" aria-hidden="true" />

      {/* Top Nav */}
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
              Try the App <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
     

