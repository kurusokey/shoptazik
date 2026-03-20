import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getVariantsByProduct } from "@/lib/supabase-data";
import TshirtProductPage from "@/components/ui/TshirtProductPage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("tshirt-monde-nouvo");

  if (!product) {
    return { title: "Produit introuvable" };
  }

  return {
    title: `${product.name} | La Mug Boutik'`,
    description: product.description,
    openGraph: {
      title: `${product.name} | La Mug Boutik'`,
      description: product.description,
      type: "website",
      images: product.image_url ? [{ url: product.image_url }] : [],
      siteName: "La Mug Boutik'",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | La Mug Boutik'`,
      description: product.description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function TshirtPage() {
  const product = await getProductBySlug("tshirt-monde-nouvo");

  if (!product) return notFound();

  const variants = await getVariantsByProduct(product.id);

  return <TshirtProductPage product={product} variants={variants} />;
}
