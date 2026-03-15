import Link from "next/link";
import { getFeaturedProject, getArtists } from "@/lib/supabase-data";
import { formatPrice, categoryLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProject();
  const artists = await getArtists();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 px-4 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            SHOP<span className="text-amber-400">TAZIK</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            La boutique du rap francophone. Vinyles, CD, K7 et merchandising
            officiel de tes artistes préférés.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/artists/fdy-phenomen"
              className="rounded-lg bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Découvrir les artistes
            </Link>
            <Link
              href="/artists/fdy-phenomen/chanteur-de-rap"
              className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-white transition hover:border-zinc-500"
            >
              Nouveautés
            </Link>
          </div>
        </div>
      </section>

      {/* Artiste du moment */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-400">
              Artiste du moment
            </h2>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="grid md:grid-cols-2">
              {/* Visuel album */}
              <div className="flex items-center justify-center bg-zinc-800 p-12">
                <div className="relative">
                  <div className="h-64 w-64 overflow-hidden rounded-lg md:h-80 md:w-80">
                    <img
                      src={featured.cover_url}
                      alt={featured.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-black">
                    NOUVEAU
                  </div>
                </div>
              </div>

              {/* Infos */}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  {featured.artist.name}
                </p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {featured.title}
                </h3>
                <p className="mt-4 text-zinc-400">{featured.description}</p>

                {/* Produits disponibles */}
                <div className="mt-6 space-y-3">
                  {featured.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-700 px-4 py-3"
                    >
                      <div>
                        <span className="text-sm font-medium text-white">
                          {categoryLabel(product.category)}
                        </span>
                        {product.is_limited && (
                          <span className="ml-2 text-xs text-amber-400">
                            Limité
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-white">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/artists/${featured.artist.slug}/${featured.slug}`}
                  className="mt-6 inline-block rounded-lg bg-amber-400 px-6 py-3 text-center font-semibold text-black transition hover:bg-amber-300"
                >
                  Voir le projet
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Liste artistes */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-white">Nos artistes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-amber-400/50"
            >
              <div className="mb-4 h-20 w-20 overflow-hidden rounded-full bg-zinc-800">
                <img
                  src={artist.image_url}
                  alt={artist.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400">
                {artist.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                {artist.bio}
              </p>
              <p className="mt-4 text-sm font-medium text-amber-400">
                Voir la discographie &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
