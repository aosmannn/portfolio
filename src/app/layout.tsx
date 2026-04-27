import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://adamosman.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Adam Osman — Founder & CS Student",
    template: "%s | Adam Osman",
  },
  description:
    "CS + Business student at Georgia State University and founder of CourseConnect AI. Building AI products at the intersection of technology and real-world impact.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Adam Osman",
    title: "Adam Osman — Founder & CS Student",
    description:
      "CS + Business student at Georgia State University and founder of CourseConnect AI. Building AI products at the intersection of technology and real-world impact.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Osman — Founder & CS Student",
    description:
      "CS + Business student at Georgia State University and founder of CourseConnect AI. Building AI products at the intersection of technology and real-world impact.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} h-full antialiased`}
    >
      <body
        className="min-h-full font-[family-name:var(--font-geist-sans)]"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        {children}
      </body>
    </html>
  );
}
