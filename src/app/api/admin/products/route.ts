import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data";

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newProduct = {
      id: crypto.randomUUID(),
      project_id: body.project_id,
      artist_id: body.artist_id,
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price, // deja en centimes (conversion faite cote client)
      image_url: body.image_url || "",
      category: body.category,
      stock: body.stock,
      is_limited: body.is_limited,
      edition_info: body.edition_info || undefined,
      shipping_delay: body.shipping_delay,
      created_at: new Date().toISOString(),
    };

    // MVP: on retourne le produit cree sans persister
    // La persistence viendra avec Supabase
    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la creation du produit" },
      { status: 400 }
    );
  }
}
