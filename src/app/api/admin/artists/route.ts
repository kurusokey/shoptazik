import { NextRequest, NextResponse } from "next/server";
import { artists } from "@/lib/data";

export async function GET() {
  return NextResponse.json(artists);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newArtist = {
      id: crypto.randomUUID(),
      name: body.name,
      slug: body.slug,
      bio: body.bio,
      image_url: body.image_url || "",
      banner_url: body.banner_url || "",
      created_at: new Date().toISOString(),
    };

    // MVP: on retourne l'artiste cree sans persister
    // La persistence viendra avec Supabase
    return NextResponse.json(newArtist, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la creation de l'artiste" },
      { status: 400 }
    );
  }
}
