import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://resumeshortlist.app"),
  title: {
    default: "ResumeShortList — Free ATS Resume Score + One‑Time Optimization",
    template: "%s — ResumeShortList",
  },
  description:
    "Upload your resume to get an explainable ATS score in ~60 seconds. Pay once to unlock optimization + ATS‑safe export.",
  openGraph: {
    title: "ResumeShortList",
    description:
      "Free ATS resume score with transparent breakdown. One‑time optimization unlock for export + job tailoring.",
    url: "https://resumeshortlist.app",
    siteName: "ResumeShortList",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
