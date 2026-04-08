// ============================================
// Webhook Marketing
// Reçoit les événements Stripe (ventes) et Buffer (publication)
// Déclenche des actions automatiques
// ============================================

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const source = request.headers.get("x-webhook-source") || "unknown";

  const supabase = getSupabase();

  // ---- Stripe : nouvelle vente ----
  if (body.type === "checkout.session.completed") {
    const session = body.data?.object;
    if (!session) return NextResponse.json({ ok: true });

    const amount = session.amount_total || 0;
    const email = session.customer_email || "anonyme";

    // Log dans une table de notifications marketing
    await supabase.from("marketing_posts").insert({
      platform: "internal",
      post_type: "notification",
      text_content: `Nouvelle vente ! ${(amount / 100).toFixed(2)} € par ${email}`,
      campaign: "auto-sales-notification",
      content_category: "valeur",
    });

    console.log(`🎉 Vente détectée : ${(amount / 100).toFixed(2)} € — notification enregistrée`);
    return NextResponse.json({ ok: true, action: "sale_logged" });
  }

  // ---- Buffer : post publié ----
  if (source === "buffer" && body.post_id) {
    // Mettre à jour le post en base
    await supabase
      .from("marketing_posts")
      .update({ published_at: new Date().toISOString() })
      .eq("buffer_post_id", body.post_id);

    console.log(`📤 Post Buffer publié : ${body.post_id}`);
    return NextResponse.json({ ok: true, action: "post_published" });
  }

  return NextResponse.json({ ok: true, action: "no_action" });
}
