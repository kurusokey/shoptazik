import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";
import CookieBanner from "@/components/ui/CookieBanner";
import NowPlaying from "@/components/ui/NowPlaying";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBar />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <NowPlaying />
      <CookieBanner />
    </>
  );
}
