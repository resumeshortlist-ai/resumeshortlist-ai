export const metadata = {
  title: "ResumeShortList.ai",
  description: "AI-powered resume screening and ATS optimization."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, Arial, sans-serif" }}>{children}</body>
    </html>
  );
}
