import Link from "next/link";
import Image from "next/image";
import { getFeaturedProject, getArtists } from "@/lib/supabase-data";
import { formatPrice, categoryLabel } from "@/lib/utils";
import AddToCartButton from "@/components/ui/AddToCartButton";
import YouTubePlayer from "@/components/ui/YouTubePlayer";
import BuyTrackButton from "@/components/ui/BuyTrackButton";
import BuyAlbumDigital from "@/components/ui/BuyAlbumDigital";
import { getYouTubeId } from "@/lib/youtube";

export const revalidate = 60;

const TRACK_PRICE = 129;

const COVER_FRONT = "/images/projects/album_chanteur_de_rap.jpg";
const AVIREX_STUDIO = "/images/projects/avirex.jpg";
const AVIREX_LIFE = "/images/projects/fdy_life.jpg";

export default async function HomePage() {
  const featured = await getFeaturedProject();
  const artists = await getArtists();

  return (
    <div style={{ background: "#1A1610" }}>
      {/* ============================================
          HERO — Le blouson Avirex en studio, plein écran
          Fdy de dos, casque, micro, en pleine session
          ============================================ */}
      <section className="relative overflow-hidden" style={{ height: "85vh", minHeight: "500px", maxHeight: "1100px" }}>
        <Image
          src={AVIREX_STUDIO}
          alt="Fdy Phenomen en studio — blouson Avirex"
          fill={true}
          priority={true}
          className="object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        {/* Overlay sombre en bas pour le texte */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(26,22,16,0.2) 0%, transparent 30%, transparent 45%, rgba(26,22,16,0.7) 70%, rgba(26,22,16,0.95) 90%, #1A1610 100%)",
          }}
        />
        {/* Overlay latéral */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: "linear-gradient(to right, rgba(26,22,16,0.5) 0%, transparent 30%, transparent 70%, rgba(26,22,16,0.3) 100%)",
          }}
        />

        {/* Contenu bas */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 md:pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color: "#C8A050" }}>
                  Frero Prod pr&eacute;sente :
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-white md:text-6xl">
                  Chanteur de Rap
                </h1>
                <p className="mt-2 text-lg text-white/50">
                  Le nouvel album de Fdy Phenomen
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/artists/fdy-phenomen/chanteur-de-rap"
                  className="rounded-xl px-7 py-3.5 font-bold text-black transition hover:brightness-110 md:px-8 md:py-4"
                  style={{ background: "linear-gradient(135deg, #C8A050, #A08030)", boxShadow: "0 6px 25px rgba(200,160,80,0.3)" }}
                >
                  D&eacute;couvrir l&apos;album
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION — Pochette front + présentation
          Transition du studio vers l'album
          ============================================ */}
      <section className="relative overflow-hidden px-4 py-16 md:py-20">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1A1610, #201A14, #1A1610)" }} />
        {/* Lueur ambre subtile */}
        <div className="absolute -right-40 top-0 h-[400px] w-[400px] rounded-full blur-[120px]" style={{ background: "rgba(200,160,80,0.06)" }} />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="flex justify-center">
              <div className="w-full max-w-[460px] overflow-hidden rounded-lg" style={{ boxShadow: "0 30px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}>
                <Image src={COVER_FRONT} alt="Chanteur de Rap — Pochette" width={600} height={600} className="block h-auto w-full" />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "#C8A050" }}>
                L&apos;album
              </p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Le rap d&apos;auteur dans sa forme la plus aboutie
              </h2>
              <p className="mt-4 leading-relaxed text-white/50">
                Chanteur de Rap, c&apos;est le manifeste de Fdy Phenomen. Le blouson Avirex
                sur le dos, le micro devant, la plume en main. 10 titres qui traversent
                les g&eacute;n&eacute;rations du hip-hop, du storytelling &agrave;
                l&apos;introspection, des collaborations l&eacute;gendaires avec
                Sir Samuel, Arsenik, IAM.
              </p>
              <Link
                href="/artists/fdy-phenomen/chanteur-de-rap"
                className="mt-6 inline-block text-sm font-semibold transition hover:opacity-70"
                style={{ color: "#C8A050" }}
              >
                Voir le projet complet &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION — Le blouson Avirex, l'univers
          Photo fdy_life.jpg en plein écran
          ============================================ */}
      <section className="relative overflow-hidden" style={{ height: "70vh", minHeight: "400px", maxHeight: "900px" }}>
        <Image
          src={AVIREX_LIFE}
          alt="L'univers de Fdy Phenomen — blouson Avirex, vinyles, discographie"
          fill={true}
          priority={true}
          className="object-cover"
          style={{ objectPosition: "center center" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(26,22,16,0.4), rgba(26,22,16,0.3), rgba(26,22,16,0.8), #1A1610)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: "linear-gradient(to right, rgba(26,22,16,0.7) 0%, transparent 40%, transparent 100%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-12 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:pb-0">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "#C8A050" }}>
                L&apos;univers
              </p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Le blouson Avirex
              </h2>
              <p className="mt-4 leading-relaxed text-white/60">
                Le blouson Avirex, c&apos;est le symbole. Celui des freestyles l&eacute;gendaires,
                des sessions studio, du crew Ghet&apos; 7 dans le dos.
                Il traverse les &eacute;poques, les albums, les sc&egrave;nes.
                Il est l&agrave;, sur la pochette, sur le dos de l&apos;artiste,
                au milieu des vinyles et des souvenirs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FORMATS / PRODUITS
          ============================================ */}
      {featured && featured.products.length > 0 && (
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1A1610, #201A14)" }} />
          {/* Avirex studio floutée en arrière-plan */}
          <div className="absolute inset-0 overflow-hidden">
            <Image src={AVIREX_STUDIO} alt="" fill={true} className="scale-125 object-cover blur-[80px]" style={{ opacity: 0.08 }} />
          </div>

          <div className="relative mx-auto max-w-5xl">
            <h2 className="mb-6 text-xl font-bold text-white md:mb-8 md:text-2xl">Formats disponibles</h2>

            <div className="grid gap-3 sm:grid-cols-3">
              {/* === VINYLE PRETIUM EDITION === */}
              {featured.products.filter((p) => p.slug === "vinyle-chanteur-de-rap-pretium").map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-xl border"
                  style={{ borderColor: "rgba(200,160,80,0.25)", background: "rgba(200,160,80,0.06)" }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={product.image_url} alt={product.name} fill={true} className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white leading-tight">Pretium Edition</h3>
                      <span
                        className="inline-flex shrink-0 items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
                        style={{ border: "1px solid rgba(200,160,80,0.5)", color: "#C8A050" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-2 w-2">
                          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                        </svg>
                        Pretium
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/30 sm:text-xs">Vinyle blanc 33T. Tirage limit&eacute; 100 ex. Photo d&eacute;dicac&eacute;e.</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
                      <a href="https://www.centrevillerecords.be/product/fdy-phenomen-chanteur-de-rap" target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-1.5 text-xs font-bold transition hover:brightness-110" style={{ background: "linear-gradient(135deg, #C8A050, #A08030)", color: "#1A1610" }}>
                        Commander
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* === VINYLE CLASSIC EDITION === */}
              {featured.products.filter((p) => p.slug === "vinyle-chanteur-de-rap-classic").map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-xl border transition hover:border-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(200,160,80,0.03)" }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={product.image_url} alt={product.name} fill={true} className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-white leading-tight">Classic Edition</h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/30 sm:text-xs">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
                      <a href="https://www.centrevillerecords.be/product/fdy" target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-1.5 text-xs font-bold transition hover:brightness-110" style={{ background: "linear-gradient(135deg, #C8A050, #A08030)", color: "#1A1610" }}>
                        Commander
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* === CD === */}
              {featured.products.filter((p) => p.category === "cd").map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-xl border transition hover:border-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(200,160,80,0.03)" }}
                >
                  <div className="relative aspect-square overflow-hidden" style={{ background: "#201A14" }}>
                    <Image src={product.image_url} alt={product.name} fill={true} className="object-contain" />
                  </div>
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-white leading-tight">CD</h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/30 sm:text-xs">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
                      <a href="https://www.centrevillerecords.be/product/fdy-phenomen-chanteur-de-rap-cd" target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-1.5 text-xs font-bold transition hover:brightness-110" style={{ background: "linear-gradient(135deg, #C8A050, #A08030)", color: "#1A1610" }}>
                        Commander
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* Album digital — masqué pour le moment */}
              {/* <BuyAlbumDigital
                title="Chanteur de Rap"
                artist="Fdy Phenomen"
                trackCount={featured.tracklist.length}
                price={999}
                coverUrl={COVER_FRONT}
              /> */}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          TRACKLIST
          ============================================ */}
      {featured && (
        <section className="relative px-4 py-16">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #201A14, #1A1610)" }} />

          <div className="relative mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-5 md:gap-12">
              <div className="hidden md:col-span-2 md:block">
                <div className="sticky top-24 overflow-hidden rounded-xl" style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
                  <Image src={COVER_FRONT} alt="Chanteur de Rap" width={600} height={600} className="block h-auto w-full" />
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Tracklist</h2>
                  <span className="text-sm text-white/30">{featured.tracklist.length} titres</span>
                </div>

                <div className="overflow-hidden rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(200,160,80,0.04)" }}>
                  {featured.tracklist.map((track, i) => {
                    const ytId = getYouTubeId(track);
                    return (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-5 py-4 transition hover:bg-white/[0.03]"
                      style={{ borderBottom: i !== featured.tracklist.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    >
                      {ytId ? (
                        <YouTubePlayer videoId={ytId} trackTitle={track} />
                      ) : (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold" style={{ color: "rgba(200,160,80,0.4)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      )}
                      <span className="flex-1 text-sm text-white/60">{track}</span>
                      {/* BuyTrackButton masqué pour le moment
                      <BuyTrackButton
                        title={track}
                        artist="Fdy Phenomen"
                        album="Chanteur de Rap"
                        price={TRACK_PRICE}
                      />
                      */}
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          ARTISTE
          ============================================ */}
      <section className="relative px-4 py-20">
        <div className="absolute inset-0" style={{ background: "#1A1610" }} />
        <div className="relative mx-auto max-w-7xl">
          <h2 className="mb-10 text-2xl font-bold text-white">L&apos;artiste</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group overflow-hidden rounded-xl border p-6 transition hover:border-[#C8A050]/30"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(200,160,80,0.04)" }}
              >
                <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/10 transition group-hover:ring-[#C8A050]/40">
                  <Image src={artist.image_url} alt={artist.name} fill={true} className="object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white transition group-hover:text-[#C8A050]">{artist.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-white/40">{artist.bio}</p>
                <p className="mt-4 text-sm font-medium" style={{ color: "#C8A050" }}>Voir la discographie &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
