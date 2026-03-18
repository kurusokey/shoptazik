import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("artists")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching artists:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des artistes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("artists")
      .insert({
        name: body.name,
        slug: body.slug,
        bio: body.bio,
        image_url: body.image_url || "",
        banner_url: body.banner_url || "",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating artist:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la creation de l'artiste" },
      { status: 400 }
    );
  }
}
