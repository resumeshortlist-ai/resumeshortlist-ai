// lib/blog.ts
export type BlogPost = {
  slug: string;
  title: string;

  // Keep both so different pages/components don't break.
  excerpt: string;
  description: string;

  // Some pages expect dateISO.
  dateISO: string; // ISO date string, e.g. "2025-12-01"
  // Optional legacy alias if any page uses `date`
  date?: string;

  readingTime: string; // e.g. "4 min"
  tags: string[];
  content: string; // markdown-ish plain text
};

export const POSTS: BlogPost[] = [
  {
    slug: "ats-resume-score-what-it-means",
    title: "ATS Resume Score: what it means (and what it doesn’t)",
    excerpt:
      "How to interpret an ATS-style score, what impacts it most, and how to improve it without ruining readability.",
    description:
      "How to interpret an ATS-style score, what impacts it most, and how to improve it without ruining readability.",
    dateISO: "2025-12-01",
    date: "2025-12-01",
    readingTime: "5 min",
    tags: ["ATS", "Resume Score", "Job Search"],
    content: `
### ATS scores are a signal — not the goal
A score is useful as a diagnostic: formatting issues, missing keyword coverage, and clarity problems.

### What improves your score fastest
- Clean structure (headings, consistent dates)
- Role-aligned keywords (skills + tools + outcomes)
- Strong, quantified bullets

### What NOT to do
- Keyword stuffing
- Tables/columns that break parsing
- Fancy templates that reduce readability
`.trim(),
  },
  {
    slug: "ats-friendly-formatting-checklist",
    title: "ATS-friendly formatting checklist (copy/paste)",
    excerpt:
      "A practical checklist to make your resume parseable and recruiter-friendly — without looking boring.",
    description:
      "A practical checklist to make your resume parseable and recruiter-friendly — without looking boring.",
    dateISO: "2025-12-03",
    date: "2025-12-03",
    readingTime: "4 min",
    tags: ["ATS", "Formatting", "Resume"],
    content: `
### Quick checklist
- Use standard headings (Experience, Education, Skills)
- Avoid tables, text boxes, and multi-column layouts
- Use a simple font and consistent spacing
- Keep dates consistent (e.g., 2022–2024)
- Export to PDF carefully (text selectable)

### Bonus: bullet structure that works
**Action + scope + impact** (with a metric whenever possible).
`.trim(),
  },
  {
    slug: "bullet-points-that-sound-executive",
    title: "Bullet points that sound executive (without fluff)",
    excerpt:
      "Turn task bullets into outcome bullets using a simple rewrite formula and examples.",
    description:
      "Turn task bullets into outcome bullets using a simple rewrite formula and examples.",
    dateISO: "2025-12-05",
    date: "2025-12-05",
    readingTime: "6 min",
    tags: ["Leadership", "Executive Resume", "Bullets"],
    content: `
### The rewrite formula
**Led X** → **Led X to achieve Y** → **Led X to achieve Y by doing Z**, quantified.

### Examples
- “Managed projects” → “Led 6 cross-functional initiatives, reducing cycle time by 18%.”
- “Improved process” → “Redesigned intake workflow, cutting rework by 30% and improving SLA compliance.”

### The trap
Avoid vague words (helped, assisted, involved). Replace with ownership + outcomes.
`.trim(),
  },
];

export const BLOG_SLUGS = POSTS.map((p) => p.slug);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

// Some pages import `getPost`
export function getPost(slug: string): BlogPost | undefined {
  return getPostBySlug(slug);
}
