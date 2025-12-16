
import Link from "next/link";

export default function MarketingHome() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <section className="grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Turn Your Resume Into a Shortlist‑Ready Profile
          </h1>
          <p className="mt-6 text-lg text-neutral-600">
            Resume Shortlist analyzes your resume using real hiring patterns,
            not generic templates — so you get shortlisted faster.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/analyze" className="btn-primary">
              Analyze My Resume
            </Link>
            <Link href="/how-it-works" className="btn-secondary">
              See How It Works
            </Link>
          </div>
          <p className="mt-3 text-sm text-neutral-500">
            No credit card required · Built for professionals
          </p>
        </div>
        <div className="rounded-xl border bg-white shadow-sm p-8 text-neutral-500">
          Product preview placeholder
        </div>
      </section>

      <section className="mt-32 grid gap-12 md:grid-cols-3">
        <div>
          <h3 className="font-medium">Built for Shortlisting</h3>
          <p className="mt-2 text-neutral-600">
            Optimized around how recruiters actually review resumes.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Professional‑Grade AI</h3>
          <p className="mt-2 text-neutral-600">
            Designed for managers, directors, and executives.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Actionable Feedback</h3>
          <p className="mt-2 text-neutral-600">
            Clear recommendations you can apply immediately.
          </p>
        </div>
      </section>

      <section className="mt-32 text-center">
        <h2 className="text-3xl font-semibold">
          See Why Resumes Get Shortlisted
        </h2>
        <Link href="/analyze" className="btn-primary mt-8 inline-block">
          Analyze My Resume
        </Link>
      </section>
    </main>
  );
}
