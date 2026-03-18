import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Webhook Stripe — reçoit les événements de paiement
// Configure le webhook dans Stripe Dashboard → Developers → Webhooks
// URL : https://boutique.la-mug.com/api/webhook
// Événement : checkout.session.completed

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Enregistrer la commande
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_email: session.customer_details?.email ?? "unknown",
          customer_name: session.customer_details?.name ?? "unknown",
          shipping_address: JSON.stringify(session.shipping_details?.address ?? {}),
          total: session.amount_total ?? 0,
          status: "paid",
          stripe_session_id: session.id,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order insert error:", orderError);
      } else {
        console.log("Order created:", order.id);
      }

      // Décrémenter le stock si des metadata de produit sont présentes
      if (session.metadata?.product_ids) {
        const productIds = session.metadata.product_ids.split(",");
        for (const productId of productIds) {
          await supabase.rpc("decrement_stock", { product_id: productId });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
