import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
});

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: { default: `${c.site.name} - ${c.site.title}`, template: `%s | ${c.site.name}` },
    description: c.home.description,
    robots: { index: false, follow: false },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
