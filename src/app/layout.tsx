import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nepali Typing — Unicode Transliteration",
  description: "Type Nepali in Romanized English and get Unicode Devanagari output with 100+ font support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}