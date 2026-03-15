"use client";

import Link from "next/link";
import { useState } from "react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewArtistPage() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    bio: "",
    image_url: "",
    banner_url: "",
  });
  const [slugManual, setSlugManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugManual ? prev.slug : slugify(value),
    }));
  }

  function handleSlugChange(value: string) {
    setSlugManual(true);
    setForm((prev) => ({ ...prev, slug: value }));
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      setMessage({ type: "success", text: `Artiste "${form.name}" cree avec succes !` });
      setForm({ name: "", slug: "", bio: "", image_url: "", banner_url: "" });
      setSlugManual(false);
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la creation de l'artiste." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/artists"
          className="mb-2 inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Retour aux artistes
        </Link>
        <h1 className="text-2xl font-bold text-white">Nouvel artiste</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Ajoutez un nouvel artiste a la boutique
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
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Nom de l&apos;artiste <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ex: Fdy Phenomen"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Slug (URL) <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">/artists/</span>
            <input
              type="text"
              id="slug"
              required
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="fdy-phenomen"
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Genere automatiquement a partir du nom. Modifiable manuellement.
          </p>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Biographie <span className="text-red-400">*</span>
          </label>
          <textarea
            id="bio"
            required
            rows={4}
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            placeholder="Biographie de l'artiste..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image_url" className="mb-1.5 block text-sm font-medium text-zinc-300">
            URL de l&apos;image (photo de profil)
          </label>
          <input
            type="text"
            id="image_url"
            value={form.image_url}
            onChange={(e) => updateField("image_url", e.target.value)}
            placeholder="/images/artists/nom-artiste.jpg"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Banner URL */}
        <div>
          <label htmlFor="banner_url" className="mb-1.5 block text-sm font-medium text-zinc-300">
            URL de la banniere
          </label>
          <input
            type="text"
            id="banner_url"
            value={form.banner_url}
            onChange={(e) => updateField("banner_url", e.target.value)}
            placeholder="/images/artists/nom-artiste-banner.jpg"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-6">
          <Link
            href="/admin/artists"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-amber-400 px-6 py-2.5 text-sm font-medium text-black transition hover:bg-amber-300 disabled:opacity-50"
          >
            {submitting ? "Creation..." : "Creer l'artiste"}
          </button>
        </div>
      </form>
    </div>
  );
}
