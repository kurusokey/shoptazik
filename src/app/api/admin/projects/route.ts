import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/lib/data";

export async function GET() {
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newProject = {
      id: crypto.randomUUID(),
      artist_id: body.artist_id,
      title: body.title,
      slug: body.slug,
      description: body.description,
      cover_url: body.cover_url || "",
      release_year: body.release_year,
      tracklist: body.tracklist || [],
      type: body.type,
      created_at: new Date().toISOString(),
    };

    // MVP: on retourne le projet cree sans persister
    // La persistence viendra avec Supabase
    return NextResponse.json(newProject, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la creation du projet" },
      { status: 400 }
    );
  }
}
