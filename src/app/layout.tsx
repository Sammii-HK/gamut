import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gamut — OKLCH Theme Builder",
  description:
    "Real-time theme builder with OKLCH colour science, WCAG contrast checking, and exportable design tokens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className="dark">
      <head>
        <meta name="darkreader-lock" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="antialiased bg-neutral-950 text-white">{children}</body>
    </html>
  );
}
