import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResumeShortList.ai",
  description: "Free ATS Resume Score — then optimize with a one-time checkout.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
