import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://adamosman.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Adam Osman — Founder & CS Student",
    template: "%s | Adam Osman",
  },
  description:
    "CS student at Georgia State University and founder of CourseConnect AI. Building AI products at the intersection of technology and real-world impact.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Adam Osman",
    title: "Adam Osman — Founder & CS Student",
    description:
      "CS student at Georgia State University and founder of CourseConnect AI. Building AI products at the intersection of technology and real-world impact.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Osman — Founder & CS Student",
    description:
      "CS student at Georgia State University and founder of CourseConnect AI. Building AI products at the intersection of technology and real-world impact.",
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
    <html lang="en">
      <body style={{ fontFamily: "Tahoma, 'Trebuchet MS', Arial, sans-serif", overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
