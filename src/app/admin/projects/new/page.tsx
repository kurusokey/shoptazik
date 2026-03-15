"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Artist } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const projectTypes = [
  { value: "album", label: "Album" },
  { value: "ep", label: "EP" },
  { value: "mixtape", label: "Mixtape" },
  { value: "single", label: "Single" },
];

export default function NewProjectPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    artist_id: "",
    description: "",
    type: "album",
    release_year: new Date().getFullYear(),
    tracklist: [""],
    cover_url: "",
  });
  const [slugManual, setSlugManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const res = await fetch("/api/admin/artists");
        const data = await res.json();
        setArtists(data);
        if (data.length > 0 && !form.artist_id) {
          setForm((prev) => ({ ...prev, artist_id: data[0].id }));
        }
      } catch (error) {
        console.error("Erreur chargement artistes:", error);
      }
    }
    fetchArtists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugManual ? prev.slug : slugify(value),
    }));
  }

  function handleSlugChange(value: string) {
    setSlugManual(true);
    setForm((prev) => ({ ...prev, slug: value }));
  }

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addTrack() {
    setForm((prev) => ({ ...prev, tracklist: [...prev.tracklist, ""] }));
  }

  function removeTrack(index: number) {
    setForm((prev) => ({
      ...prev,
      tracklist: prev.tracklist.filter((_, i) => i !== index),
    }));
  }

  function updateTrack(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      tracklist: prev.tracklist.map((t, i) => (i === index ? value : t)),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      ...form,
      tracklist: form.tracklist.filter((t) => t.trim() !== ""),
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      setMessage({ type: "success", text: `Projet "${form.title}" cree avec succes !` });
      setForm({
        title: "",
        slug: "",
        artist_id: artists[0]?.id ?? "",
        description: "",
        type: "album",
        release_year: new Date().getFullYear(),
        tracklist: [""],
        cover_url: "",
      });
      setSlugManual(false);
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la creation du projet." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="mb-2 inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Retour aux projets
        </Link>
        <h1 className="text-2xl font-bold text-white">Nouveau projet</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Ajoutez un album, EP, mixtape ou single
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
              : "border-red-400/20 bg-red-400/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Titre du projet <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            required
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ex: Chanteur de Rap"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Slug (URL) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="slug"
            required
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="chanteur-de-rap"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Artist select */}
        <div>
          <label htmlFor="artist_id" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Artiste <span className="text-red-400">*</span>
          </label>
          <select
            id="artist_id"
            required
            value={form.artist_id}
            onChange={(e) => updateField("artist_id", e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          >
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type + Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Type <span className="text-red-400">*</span>
            </label>
            <select
              id="type"
              required
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            >
              {projectTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="release_year" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Annee de sortie <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              id="release_year"
              required
              min={1950}
              max={2030}
              value={form.release_year}
              onChange={(e) => updateField("release_year", parseInt(e.target.value))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Description du projet..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Tracklist */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Tracklist
          </label>
          <div className="space-y-2">
            {form.tracklist.map((track, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-8 text-right text-xs text-zinc-500">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={track}
                  onChange={(e) => updateTrack(index, e.target.value)}
                  placeholder={`Titre du morceau ${index + 1}`}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
                {form.tracklist.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTrack(index)}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTrack}
            className="mt-2 text-sm text-amber-400 transition hover:text-amber-300"
          >
            + Ajouter un morceau
          </button>
        </div>

        {/* Cover URL */}
        <div>
          <label htmlFor="cover_url" className="mb-1.5 block text-sm font-medium text-zinc-300">
            URL de la pochette
          </label>
          <input
            type="text"
            id="cover_url"
            value={form.cover_url}
            onChange={(e) => updateField("cover_url", e.target.value)}
            placeholder="/images/projects/nom-projet.jpg"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-6">
          <Link
            href="/admin/projects"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
          >
            {submitting ? "Creation..." : "Creer le projet"}
          </button>
        </div>
      </form>
    </div>
  );
}
