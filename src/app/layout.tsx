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
    default: "La Mug Boutik' — La boutique de la culture urbaine",
    template: "%s | La Mug Boutik'",
  },
  description:
    "Vinyles, CD, K7 et merchandising officiel. Rap francophone, artistes indépendants, éditions limitées.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "La Mug Boutik'",
    title: "La Mug Boutik' — La boutique de la culture urbaine",
    description:
      "Vinyles, CD, K7 et merchandising officiel. Rap francophone, artistes indépendants, éditions limitées.",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Mug Boutik' — La boutique de la culture urbaine",
    description:
      "Vinyles, CD, K7 et merchandising officiel. Rap francophone, artistes indépendants, éditions limitées.",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://boutique.la-mug.com"
  ),
  manifest: "/manifest.json",
  other: {
    "theme-color": "#1A1610",
  },
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
