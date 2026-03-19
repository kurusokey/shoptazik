import { MetadataRoute } from "next";
import { getArtists, getProjectsByArtist } from "@/lib/supabase-data";

const BASE_URL = "https://boutique.la-mug.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/cart`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/cgv`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/a-propos`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/ateliers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  // Pages dynamiques
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const artists = await getArtists();

    for (const artist of artists) {
      // Page artiste
      dynamicPages.push({
        url: `${BASE_URL}/artists/${artist.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });

      // Pages projets de cet artiste
      const projects = await getProjectsByArtist(artist.id);
      for (const project of projects) {
        dynamicPages.push({
          url: `${BASE_URL}/artists/${artist.slug}/${project.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap:", error);
  }

  return [...staticPages, ...dynamicPages];
}
