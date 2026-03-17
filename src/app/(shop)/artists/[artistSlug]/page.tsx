import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getArtistBySlug, getProjectsByArtist } from "@/lib/supabase-data";
import ProjectCard from "@/components/ui/ProjectCard";

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

  const title = `${artist.name} | Shoptazik`;
  const description =
    artist.bio || `Discographie complète de ${artist.name} sur Shoptazik.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: artist.image_url ? [{ url: artist.image_url }] : [],
      siteName: "Shoptazik",
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
