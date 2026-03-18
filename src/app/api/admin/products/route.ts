import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        project_id: body.project_id,
        artist_id: body.artist_id,
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        image_url: body.image_url || "",
        category: body.category,
        stock: body.stock,
        is_limited: body.is_limited,
        edition_info: body.edition_info || null,
        shipping_delay: body.shipping_delay,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la creation du produit" },
      { status: 400 }
    );
  }
}
