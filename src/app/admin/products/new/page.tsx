"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Artist, Project } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categories = [
  { value: "vinyle", label: "Vinyle" },
  { value: "cd", label: "CD" },
  { value: "k7", label: "K7" },
  { value: "tshirt", label: "T-shirt" },
  { value: "hoodie", label: "Hoodie" },
  { value: "poster", label: "Poster" },
  { value: "other", label: "Autre" },
];

export default function NewProductPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    project_id: "",
    category: "vinyle",
    price_euros: "",
    description: "",
    stock: 0,
    is_limited: false,
    edition_info: "",
    shipping_delay: "3-5 jours ouvres",
    image_url: "",
  });
  const [slugManual, setSlugManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [artistsRes, projectsRes] = await Promise.all([
          fetch("/api/admin/artists"),
          fetch("/api/admin/projects"),
        ]);
        const artistsData = await artistsRes.json();
        const projectsData = await projectsRes.json();
        setArtists(artistsData);
        setProjects(projectsData);
        if (projectsData.length > 0 && !form.project_id) {
          setForm((prev) => ({ ...prev, project_id: projectsData[0].id }));
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function updateField(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function getArtistIdForProject(projectId: string): string {
    return projects.find((p) => p.id === projectId)?.artist_id ?? "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const priceEuros = parseFloat(form.price_euros);
    if (isNaN(priceEuros) || priceEuros <= 0) {
      setMessage({ type: "error", text: "Le prix doit etre un nombre positif." });
      setSubmitting(false);
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      project_id: form.project_id,
      artist_id: getArtistIdForProject(form.project_id),
      category: form.category,
      price: Math.round(priceEuros * 100), // conversion euros -> centimes
      description: form.description,
      stock: form.stock,
      is_limited: form.is_limited,
      edition_info: form.is_limited ? form.edition_info : undefined,
      shipping_delay: form.shipping_delay,
      image_url: form.image_url,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      setMessage({ type: "success", text: `Produit "${form.name}" cree avec succes !` });
      setForm({
        name: "",
        slug: "",
        project_id: projects[0]?.id ?? "",
        category: "vinyle",
        price_euros: "",
        description: "",
        stock: 0,
        is_limited: false,
        edition_info: "",
        shipping_delay: "3-5 jours ouvres",
        image_url: "",
      });
      setSlugManual(false);
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la creation du produit." });
    } finally {
      setSubmitting(false);
    }
  }

  function getProjectLabel(project: Project): string {
    const artist = artists.find((a) => a.id === project.artist_id);
    return artist ? `${project.title} — ${artist.name}` : project.title;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="mb-2 inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Retour aux produits
        </Link>
        <h1 className="text-2xl font-bold text-white">Nouveau produit</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Ajoutez un produit a la boutique (vinyle, CD, merch...)
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
            Nom du produit <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder='Ex: Vinyle "Chanteur de Rap" — Classic Edition'
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
            placeholder="vinyle-chanteur-de-rap-classic"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Project select */}
        <div>
          <label htmlFor="project_id" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Projet associe <span className="text-red-400">*</span>
          </label>
          <select
            id="project_id"
            required
            value={form.project_id}
            onChange={(e) => updateField("project_id", e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {getProjectLabel(project)}
              </option>
            ))}
          </select>
        </div>

        {/* Category + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Categorie <span className="text-red-400">*</span>
            </label>
            <select
              id="category"
              required
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price_euros" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Prix (en euros) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="price_euros"
                required
                min="0.01"
                step="0.01"
                value={form.price_euros}
                onChange={(e) => updateField("price_euros", e.target.value)}
                placeholder="29.90"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 pr-8 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                EUR
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Sera converti en centimes automatiquement
            </p>
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
            placeholder="Description du produit..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Stock + Shipping */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stock" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Stock <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              id="stock"
              required
              min="0"
              value={form.stock}
              onChange={(e) => updateField("stock", parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <div>
            <label htmlFor="shipping_delay" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Delai de livraison
            </label>
            <input
              type="text"
              id="shipping_delay"
              value={form.shipping_delay}
              onChange={(e) => updateField("shipping_delay", e.target.value)}
              placeholder="3-5 jours ouvres"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Limited edition */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_limited"
              checked={form.is_limited}
              onChange={(e) => updateField("is_limited", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-amber-400 focus:ring-amber-400"
            />
            <label htmlFor="is_limited" className="text-sm font-medium text-zinc-300">
              Edition limitee
            </label>
          </div>

          {form.is_limited && (
            <div className="mt-3">
              <label htmlFor="edition_info" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Informations sur l&apos;edition
              </label>
              <input
                type="text"
                id="edition_info"
                value={form.edition_info}
                onChange={(e) => updateField("edition_info", e.target.value)}
                placeholder="Ex: Tirage limite a 300 exemplaires"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image_url" className="mb-1.5 block text-sm font-medium text-zinc-300">
            URL de l&apos;image
          </label>
          <input
            type="text"
            id="image_url"
            value={form.image_url}
            onChange={(e) => updateField("image_url", e.target.value)}
            placeholder="/images/products/nom-produit.jpg"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-6">
          <Link
            href="/admin/products"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {submitting ? "Creation..." : "Creer le produit"}
          </button>
        </div>
      </form>
    </div>
  );
}
