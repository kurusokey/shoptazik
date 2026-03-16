import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shoptazik — La boutique du rap francophone",
    template: "%s | Shoptazik",
  },
  description:
    "Vinyles, CD, K7 et merchandising officiel. Rap francophone, artistes indépendants, éditions limitées.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Shoptazik",
    title: "Shoptazik — La boutique du rap francophone",
    description:
      "Vinyles, CD, K7 et merchandising officiel. Rap francophone, artistes indépendants, éditions limitées.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shoptazik — La boutique du rap francophone",
    description:
      "Vinyles, CD, K7 et merchandising officiel. Rap francophone, artistes indépendants, éditions limitées.",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://shoptazik.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
