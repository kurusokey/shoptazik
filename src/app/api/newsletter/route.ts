import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "L'adresse email est requise." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "L'adresse email n'est pas valide." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email: trimmedEmail });

    if (error) {
      // Duplicate email (unique constraint violation)
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Cette adresse est déjà inscrite !" },
          { status: 200 }
        );
      }
      console.error("Newsletter insert error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'inscription. Réessaie plus tard." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Inscription réussie ! Merci." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }
}
