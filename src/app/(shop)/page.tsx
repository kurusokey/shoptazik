import Link from "next/link";
import { getFeaturedProject, getArtists } from "@/lib/supabase-data";
import { formatPrice, categoryLabel } from "@/lib/utils";
import FlamboyantFlower, {
  FlamboyantLeaf,
} from "@/components/ui/FlamboyantFlower";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProject();
  const artists = await getArtists();

  return (
    <div className="relative overflow-hidden bg-[#0a0608]">
      {/* ============================================
          HERO — Immersion totale Flamboyant
          ============================================ */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Fond multi-couches bordeaux/mauve */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a0a18] via-[#1a0610] to-[#0a0608]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#6B1D3A]/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#DC143C]/10 via-transparent to-transparent" />

        {/* Fleurs de flamboyant décoratives */}
        <FlamboyantFlower className="absolute -left-16 top-12 h-64 w-64 -rotate-12" color="#DC143C" opacity={0.08} />
        <FlamboyantFlower className="absolute right-8 top-24 h-48 w-48 rotate-45" color="#C41E3A" opacity={0.06} />
        <FlamboyantFlower className="absolute -right-20 bottom-32 h-72 w-72 rotate-12" color="#DC143C" opacity={0.07} />
        <FlamboyantFlower className="absolute left-1/4 bottom-16 h-40 w-40 -rotate-30" color="#8B2252" opacity={0.05} />
        <FlamboyantLeaf className="absolute left-8 bottom-48 h-16 w-32 rotate-12" color="#2D5A27" opacity={0.08} />
        <FlamboyantLeaf className="absolute right-24 top-64 h-12 w-24 -rotate-20" color="#2D5A27" opacity={0.06} />
        <FlamboyantLeaf className="absolute left-1/3 top-32 h-10 w-20 rotate-6" color="#3A6B33" opacity={0.05} />

        {/* Particules de lumière */}
        <div className="absolute left-1/4 top-1/4 h-2 w-2 rounded-full bg-[#DC143C]/20 blur-sm" />
        <div className="absolute right-1/3 top-1/3 h-3 w-3 rounded-full bg-[#C41E3A]/15 blur-sm" />
        <div className="absolute left-2/3 top-1/5 h-2 w-2 rounded-full bg-[#8B2252]/25 blur-sm" />

        {/* Contenu Hero */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 pt-16 md:flex-row md:gap-12 md:pt-24">
          {/* Pochette album — gauche */}
          {featured && (
            <div className="relative mb-8 shrink-0 md:mb-0">
              {/* Lueur rouge derrière */}
              <div className="absolute -inset-8 rounded-full bg-[#DC143C]/15 blur-3xl" />
              <div className="absolute -inset-4 rounded-full bg-[#6B1D3A]/20 blur-2xl" />
              <div className="relative h-72 w-72 overflow-hidden rounded-2xl shadow-2xl shadow-[#DC143C]/30 ring-1 ring-[#DC143C]/20 md:h-[420px] md:w-[420px]">
                <img
                  src={featured.cover_url}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Fleur sur le coin de la pochette */}
              <FlamboyantFlower className="absolute -bottom-6 -right-6 h-24 w-24 rotate-12" color="#DC143C" opacity={0.3} />
            </div>
          )}

          {/* Texte — droite */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#DC143C]/80">
              Shoptazik pr&eacute;sente
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight text-white md:text-7xl">
              <span className="bg-gradient-to-r from-white via-[#f0d0d0] to-[#DC143C] bg-clip-text text-transparent">
                FLAMBOYANT
              </span>
            </h1>
            <p className="mt-2 text-xl font-light text-[#DC143C]/60">
              Fdy Phenomen
            </p>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-[#d4a0a0]/70 md:mx-0">
              Un album ambitieux o&ugrave; Fdy Phenomen d&eacute;ploie tout son
              talent d&apos;&eacute;criture sur des productions riches et
              vari&eacute;es. Comme la fleur de flamboyant, ce projet est
              rouge, vif, et impossible &agrave; ignorer.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
              <Link
                href="/artists/fdy-phenomen/flamboyant"
                className="rounded-xl bg-gradient-to-r from-[#DC143C] to-[#8B2252] px-8 py-4 text-center font-bold text-white shadow-lg shadow-[#DC143C]/25 transition hover:shadow-xl hover:shadow-[#DC143C]/40"
              >
                D&eacute;couvrir l&apos;album
              </Link>
              <Link
                href="/artists/fdy-phenomen"
                className="rounded-xl border border-[#DC143C]/25 px-8 py-4 text-center font-semibold text-[#d4a0a0] transition hover:border-[#DC143C]/50 hover:text-white"
              >
                Toute la discographie
              </Link>
            </div>
          </div>
        </div>

        {/* Bande décorative bas du hero — pétales qui tombent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DC143C]/30 to-transparent" />
      </section>

      {/* ============================================
          SECTION FORMATS — Produits Flamboyant
          ============================================ */}
      {featured && featured.products.length > 0 && (
        <section className="relative px-4 py-20">
          {/* Fond subtil */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a0610] via-[#0a0608] to-[#0a0608]" />
          <FlamboyantFlower className="absolute -right-12 top-8 h-56 w-56 rotate-45" color="#DC143C" opacity={0.04} />
          <FlamboyantLeaf className="absolute left-12 bottom-12 h-12 w-24 -rotate-6" color="#2D5A27" opacity={0.06} />

          <div className="relative mx-auto max-w-7xl">
            <div className="mb-10 flex items-center gap-4">
              <FlamboyantFlower className="h-8 w-8 shrink-0" color="#DC143C" opacity={0.4} />
              <h2 className="text-2xl font-bold text-white">
                Disponible en vinyle, CD &amp; merch
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#DC143C]/20 to-transparent" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.products.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-xl border border-[#DC143C]/10 bg-gradient-to-br from-[#1a0a10] to-[#0f0608] transition hover:border-[#DC143C]/30"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    {product.is_limited && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#DC143C] px-3 py-1 text-xs font-bold text-white shadow-lg shadow-[#DC143C]/30">
                        &Eacute;dition limit&eacute;e
                      </span>
                    )}
                    <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-[#d4a0a0]">
                      {categoryLabel(product.category)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-[#a07070]">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-white">
                          {formatPrice(product.price)}
                        </span>
                        {product.edition_info && (
                          <p className="text-xs text-[#DC143C]">
                            {product.edition_info}
                          </p>
                        )}
                      </div>
                      <Link
                        href="/artists/fdy-phenomen/flamboyant"
                        className="rounded-lg bg-[#DC143C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#C41E3A]"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          CITATION / UNIVERS
          ============================================ */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0608] via-[#150810] to-[#0a0608]" />

        {/* Composition florale large */}
        <FlamboyantFlower className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2" color="#DC143C" opacity={0.03} />
        <FlamboyantFlower className="absolute -left-8 top-1/4 h-32 w-32 -rotate-45" color="#8B2252" opacity={0.06} />
        <FlamboyantFlower className="absolute -right-8 bottom-1/4 h-32 w-32 rotate-20" color="#DC143C" opacity={0.06} />
        <FlamboyantLeaf className="absolute right-1/4 top-8 h-10 w-20 rotate-12" color="#2D5A27" opacity={0.07} />
        <FlamboyantLeaf className="absolute left-1/4 bottom-8 h-10 w-20 -rotate-12" color="#3A6B33" opacity={0.07} />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          {/* Fleur au dessus de la citation */}
          <div className="mb-8 flex justify-center">
            <FlamboyantFlower className="h-16 w-16" color="#DC143C" opacity={0.35} />
          </div>

          <blockquote className="text-2xl font-light leading-relaxed text-[#d4a0a0]/80 md:text-3xl">
            &laquo;&nbsp;Le flamboyant, c&apos;est l&apos;arbre qui prend feu
            sans br&ucirc;ler. C&apos;est le rouge qui explose au milieu du
            vert. C&apos;est la beaut&eacute; qui s&apos;impose.
            <span className="font-semibold text-[#DC143C]">
              &nbsp;Cet album, c&apos;est &ccedil;a.
            </span>
            &nbsp;&raquo;
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#DC143C]/40" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#DC143C]/60">
              Fdy Phenomen
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#DC143C]/40" />
          </div>
        </div>
      </section>

      {/* ============================================
          TRACKLIST PREVIEW
          ============================================ */}
      {featured && (
        <section className="relative px-4 py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#1a0610]/50 via-transparent to-transparent" />
          <FlamboyantLeaf className="absolute right-16 top-4 h-10 w-20 rotate-6" color="#2D5A27" opacity={0.06} />

          <div className="relative mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <FlamboyantFlower className="h-8 w-8 shrink-0" color="#DC143C" opacity={0.4} />
              <h2 className="text-2xl font-bold text-white">Tracklist</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#DC143C]/20 to-transparent" />
              <span className="text-sm text-[#a07070]">
                {featured.tracklist.length} titres
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#DC143C]/10 bg-[#0f0608]">
              {featured.tracklist.map((track, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-6 py-3.5 transition hover:bg-[#1a0a10] ${
                    i !== featured.tracklist.length - 1
                      ? "border-b border-[#DC143C]/5"
                      : ""
                  }`}
                >
                  <span className="w-8 text-right text-sm font-medium text-[#DC143C]/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-[#d4a0a0]">{track}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/artists/fdy-phenomen/flamboyant"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#DC143C] transition hover:text-[#f05070]"
              >
                Voir le projet complet
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          ARTISTE
          ============================================ */}
      <section className="relative px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0608] via-[#120810] to-[#0a0608]" />
        <FlamboyantFlower className="absolute -left-16 top-1/3 h-48 w-48 -rotate-30" color="#DC143C" opacity={0.04} />
        <FlamboyantFlower className="absolute -right-16 bottom-1/4 h-48 w-48 rotate-30" color="#8B2252" opacity={0.04} />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-center gap-4">
            <FlamboyantFlower className="h-8 w-8 shrink-0" color="#DC143C" opacity={0.4} />
            <h2 className="text-2xl font-bold text-white">L&apos;artiste</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[#DC143C]/20 to-transparent" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group overflow-hidden rounded-xl border border-[#DC143C]/10 bg-gradient-to-br from-[#1a0a10] to-[#0f0608] p-6 transition hover:border-[#DC143C]/30"
              >
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-[#DC143C]/20 transition group-hover:ring-[#DC143C]/50">
                  <img
                    src={artist.image_url}
                    alt={artist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white transition group-hover:text-[#DC143C]">
                  {artist.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-[#a07070]">
                  {artist.bio}
                </p>
                <p className="mt-4 text-sm font-medium text-[#DC143C]">
                  Voir la discographie &rarr;
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER FLORAL — Bande de fleurs en bas
          ============================================ */}
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0608] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-4 opacity-10">
          <FlamboyantFlower className="h-20 w-20 -rotate-12" color="#DC143C" opacity={1} />
          <FlamboyantFlower className="h-28 w-28" color="#C41E3A" opacity={1} />
          <FlamboyantFlower className="h-16 w-16 rotate-20" color="#8B2252" opacity={1} />
          <FlamboyantFlower className="h-24 w-24 -rotate-6" color="#DC143C" opacity={1} />
          <FlamboyantFlower className="h-20 w-20 rotate-30" color="#C41E3A" opacity={1} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DC143C]/20 to-transparent" />
      </div>
    </div>
  );
}
