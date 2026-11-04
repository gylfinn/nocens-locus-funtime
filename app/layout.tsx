import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

// On <html>, so the --font-sans token (defined on :root) can resolve it.
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nocens Locus Funtime",
  description: "Make a copy of a guide export for each friend's BattleTag.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={barlow.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
