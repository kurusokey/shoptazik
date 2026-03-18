import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getArtistBySlug, getProjectsByArtist } from "@/lib/supabase-data";
import ProjectCard from "@/components/ui/ProjectCard";

export const revalidate = 60;

interface ArtistPageProps {
  params: Promise<{ artistSlug: string }>;
}

export async function generateMetadata({
  params,
}: ArtistPageProps): Promise<Metadata> {
  const { artistSlug } = await params;
  const artist = await getArtistBySlug(artistSlug);

  if (!artist) {
    return { title: "Artiste introuvable" };
  }

  const title = `${artist.name} | La Mug Boutik'`;
  const description =
    artist.bio || `Discographie complète de ${artist.name} sur La Mug Boutik'.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: artist.image_url ? [{ url: artist.image_url }] : [],
      siteName: "La Mug Boutik'",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: artist.image_url ? [artist.image_url] : [],
    },
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { artistSlug } = await params;
  const artist = await getArtistBySlug(artistSlug);

  if (!artist) return notFound();

  const allProjects = await getProjectsByArtist(artist.id);

  // Séparer par catégorie (exclure les singles liés à un album)
  const albums = allProjects.filter((p) => p.type === "album");
  const mixtapes = allProjects.filter((p) => p.type === "mixtape");
  const eps = allProjects.filter((p) => p.type === "ep");
  const singlesStandalone = allProjects.filter(
    (p) => p.type === "single" && !p.parent_project_id
  );

  const totalMain = albums.length + mixtapes.length + eps.length;

  return (
    <div>
      {/* Banner artiste */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-950 px-4 py-10 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-700 md:h-40 md:w-40">
              <Image
                src={artist.image_url}
                alt={artist.name}
                fill={true}
                className="object-cover"
              />
            </div>

            <div className="text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                Artiste
              </p>
              <h1 className="mt-1 text-4xl font-bold text-white md:text-5xl">
                {artist.name}
              </h1>
              <p className="mt-4 max-w-2xl text-zinc-400">{artist.bio}</p>

              {/* Réseaux sociaux */}
              {artistSlug === "fdy-phenomen" && (
                <div className="mt-4 flex items-center justify-center gap-3 md:justify-start">
                  <a
                    href="https://www.instagram.com/fdyphenomen/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                    aria-label="Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-zinc-300">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@FDYPhenomen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                    aria-label="YouTube"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-zinc-300">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href="https://open.spotify.com/artist/1Fvf7GTHUjkFdkTkzENxAo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                    aria-label="Spotify"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-zinc-300">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  </a>
                </div>
              )}

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-zinc-500 md:justify-start">
                {albums.length > 0 && (
                  <span>
                    {albums.length} album{albums.length > 1 ? "s" : ""}
                  </span>
                )}
                {mixtapes.length > 0 && (
                  <span>
                    {mixtapes.length} mixtape{mixtapes.length > 1 ? "s" : ""}
                  </span>
                )}
                {eps.length > 0 && (
                  <span>
                    {eps.length} EP{eps.length > 1 ? "s" : ""}
                  </span>
                )}
                {singlesStandalone.length > 0 && (
                  <span>
                    {singlesStandalone.length} inédit
                    {singlesStandalone.length > 1 ? "s" : ""}
                  </span>
                )}
                <span className="text-zinc-600">&middot;</span>
                <span>{totalMain + singlesStandalone.length} projets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Albums */}
      {albums.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 pb-6">
          <h2 className="mb-6 text-2xl font-bold text-white">Albums</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {albums.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                artistSlug={artist.slug}
              />
            ))}
          </div>
        </section>
      )}

      {/* Mixtapes */}
      {mixtapes.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6">
          <h2 className="mb-6 text-2xl font-bold text-white">Mixtapes</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mixtapes.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                artistSlug={artist.slug}
              />
            ))}
          </div>
        </section>
      )}

      {/* EPs */}
      {eps.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6">
          <h2 className="mb-6 text-2xl font-bold text-white">EPs</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {eps.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                artistSlug={artist.slug}
              />
            ))}
          </div>
        </section>
      )}

      {/* Singles & Inédits (hors singles liés à un album) */}
      {singlesStandalone.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6 pb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Singles &amp; Inédits
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {singlesStandalone.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                artistSlug={artist.slug}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
