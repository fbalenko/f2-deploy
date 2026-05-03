import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";

const description =
  "A field brief by Filip Balenko applying for F2's AI Deployment Strategist role. Customer persona, workflow decomposition, 10-prompt library, output audit rubric, and a 30/60/90 deployment plan for a mid-market private credit fund.";

export const metadata: Metadata = {
  title: SITE.title,
  description,
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE.title,
    description,
    type: "article",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
