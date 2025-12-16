export type BlogPost = {
  slug: string;
  title: string;
  dateISO: string;
  excerpt: string;
  content: string; // simple markdown-ish text
};

export const POSTS: BlogPost[] = [
  {
    slug: "ats-resume-score-what-it-means",
    title: "What an ATS Resume Score Actually Means (and what it doesn’t)",
    dateISO: "2025-12-16",
    excerpt:
      "Resume scores can be helpful when they’re transparent. Here’s how to interpret them and improve your odds without gimmicks.",
    content: `
## The problem with “mystery scores”
Many tools give you a number without telling you *why*. That’s not useful.

## What ResumeShortList scores
We score for: ATS structure, section completeness, clarity, impact/metrics, and keyword coverage.

## How to improve fast
- Add a Skills section
- Quantify impact
- Use consistent headings
- Match the role’s keywords (honestly)
`
  },
  {
    slug: "ats-friendly-formatting-checklist",
    title: "ATS-Friendly Resume Formatting Checklist (PDF + DOCX)",
    dateISO: "2025-12-16",
    excerpt:
      "A practical checklist for formatting that parses cleanly in common ATS systems—no gimmicks, just fundamentals.",
    content: `
## Keep it simple
Use one column, plain headings, and standard fonts.

## Avoid common parsing failures
- Tables and columns
- Graphics/icons as text
- Headers/footers for key info

## Export safely
DOCX is safest for parsing; PDF can work if text is selectable and structure is simple.
`
  },
  {
    slug: "bullet-points-that-sound-executive",
    title: "Executive Bullet Points: The 3-Part Formula",
    dateISO: "2025-12-16",
    excerpt:
      "A straightforward formula for bullets that read senior and prove impact—especially for Strategy & Ops roles.",
    content: `
## The 3-part formula
**Action** + **What** + **Outcome**
Example: “Led global operating model redesign, reducing cycle time 18% and improving margin 3.2pts.”

## Add credibility
Name the scope: region, business unit, $ size, headcount.

## Keep it ATS-safe
Plain text bullets, consistent dates, and standard headings.
`
  }
];

export function getPost(slug: string) {
  return POSTS.find(p => p.slug === slug) || null;
}
