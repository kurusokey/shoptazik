import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";
import { projectTypeLabel } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  artistSlug: string;
}

export default function ProjectCard({ project, artistSlug }: ProjectCardProps) {
  return (
    <Link
      href={`/artists/${artistSlug}/${project.slug}`}
      className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-amber-400/50"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <Image
          src={project.cover_url}
          alt={project.title}
          fill={true}
          className="object-cover transition group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
          {projectTypeLabel(project.type)}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
          {project.release_year}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white group-hover:text-amber-400">
          {project.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
          {project.description}
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          {project.tracklist.length} titres
        </p>
      </div>
    </Link>
  );
}
