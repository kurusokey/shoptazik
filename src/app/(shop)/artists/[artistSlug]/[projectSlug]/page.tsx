import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProductsByProject,
  getChildProjects,
} from "@/lib/supabase-data";
import ProductCard from "@/components/ui/ProductCard";
import { projectTypeLabel } from "@/lib/utils";
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{ artistSlug: string; projectSlug: string }>;
}

// Thèmes par projet
function getProjectTheme(slug: string) {
  if (slug === "flamboyant") {
    return {
      bg: "#1a0e14",
      bgGradient: "linear-gradient(170deg, #3A1528, #2A0E1C, #1a0e14)",
      sectionBg: "rgba(90,48,69,0.15)",
      border: "rgba(90,32,64,0.15)",
      accent: "#C07088",
      accentStrong: "#D41920",
      text: "#9A7080",
      hoverBorder: "border-[#D41920]/30",
      singleBadgeBg: "bg-pink-500/10",
      singleBadgeText: "text-pink-400",
      singleHover: "hover:border-pink-500/40",
    };
  }
  // Thème par défaut
  return {
    bg: "#0f0f0f",
    bgGradient: "linear-gradient(to bottom, #1a1a1a, #0f0f0f)",
    sectionBg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.06)",
    accent: "#C8A050",
    accentStrong: "#C8A050",
    text: "rgba(255,255,255,0.5)",
    hoverBorder: "border-amber-500/30",
    singleBadgeBg: "bg-amber-500/10",
    singleBadgeText: "text-amber-400",
    singleHover: "hover:border-amber-500/40",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { artistSlug, projectSlug } = await params;
  const project = await getProjectBySlug(artistSlug, projectSlug);

  if (!project) return notFound();

  const products = await getProductsByProject(project.id);
  const singles = await getChildProjects(project.id);
  const theme = getProjectTheme(projectSlug);
  const isFlamboyant = projectSlug === "flamboyant";

  return (
    <div style={{ background: theme.bg }}>
      {/* En-tête du projet */}
      <section className="px-4 py-16" style={{ background: theme.bgGradient }}>
        {/* Fond pochette floutée pour Flamboyant */}
        {isFlamboyant && (
          <div className="absolute inset-0 overflow-hidden">
            <img src={project.cover_url} alt="" className="h-full w-full scale-125 object-cover blur-[80px]" style={{ opacity: 0.1 }} />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm" style={{ color: theme.text }}>
            <Link href="/" className="transition hover:text-white">Accueil</Link>
            <span>/</span>
            <Link href={`/artists/${artistSlug}`} className="transition hover:text-white">
              {project.artist.name}
            </Link>
            <span>/</span>
            <span className="text-white/80">{project.title}</span>
          </nav>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Pochette */}
            <div className="flex items-center justify-center">
              <div
                className="h-72 w-72 overflow-hidden rounded-xl md:h-96 md:w-96"
                style={{
                  boxShadow: isFlamboyant
                    ? "0 30px 70px rgba(90,20,40,0.5)"
                    : "0 30px 70px rgba(0,0,0,0.5)",
                }}
              >
                <img src={project.cover_url} alt={project.title} className="h-full w-full object-cover" />
              </div>
            </div>

            {/* Infos projet */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: theme.sectionBg, color: theme.accent }}
                >
                  {projectTypeLabel(project.type)}
                </span>
                <span className="text-sm" style={{ color: theme.text }}>
                  {project.release_year}
                </span>
              </div>

              <Link
                href={`/artists/${artistSlug}`}
                className="mt-3 text-sm font-semibold transition hover:opacity-80"
                style={{ color: theme.accent }}
              >
                {project.artist.name}
              </Link>

              <h1 className="mt-1 text-3xl font-bold text-white md:text-4xl">
                {project.title}
              </h1>

              <p className="mt-4 leading-relaxed" style={{ color: theme.text }}>
                {project.description}
              </p>

              <div className="mt-6 text-sm" style={{ color: theme.text }}>
                {project.tracklist.length} titres
                {singles.length > 0 && (
                  <span>
                    {" "}&middot; {singles.length} single{singles.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Singles extraits de l'album */}
      {singles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="mb-6 text-xl font-bold text-white">
            Singles extraits de l&apos;album
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {singles.map((single) => (
              <Link
                key={single.id}
                href={`/artists/${artistSlug}/${single.slug}`}
                className={`group flex gap-5 overflow-hidden rounded-xl border p-4 transition ${theme.singleHover}`}
                style={{ borderColor: theme.border, background: theme.sectionBg }}
              >
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg">
                  <img src={single.cover_url} alt={single.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className={`mb-1 inline-block w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${theme.singleBadgeBg} ${theme.singleBadgeText}`}>
                    Single
                  </span>
                  <h3 className="text-lg font-bold text-white transition" style={{ color: "white" }}>
                    {single.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm" style={{ color: theme.text }}>
                    {single.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tracklist */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-xl font-bold text-white">Tracklist</h2>
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: theme.border, background: theme.sectionBg }}>
          {project.tracklist.map((track, i) => {
            const isSingle = singles.some(
              (s) =>
                s.title.toLowerCase() === track.toLowerCase() ||
                track.toLowerCase().includes(s.title.toLowerCase())
            );
            return (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-3"
                style={{
                  borderBottom: i !== project.tracklist.length - 1 ? `1px solid ${theme.border}` : "none",
                }}
              >
                <span className="w-8 text-right text-sm" style={{ color: `${theme.accentStrong}66` }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`text-sm ${isSingle ? "font-medium" : ""}`} style={{ color: isSingle ? theme.accentStrong : "rgba(255,255,255,0.7)" }}>
                  {track}
                </span>
                {isSingle && (
                  <span className={`rounded-full px-2 py-0.5 text-xs ${theme.singleBadgeBg} ${theme.singleBadgeText}`}>
                    Single
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Produits disponibles */}
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="mb-6 text-xl font-bold text-white">
            Acheter ce projet
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
