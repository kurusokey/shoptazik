import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmation } from "@/lib/email";

// ============================================
// Webhook Stripe — Réception des événements de paiement
// ============================================
//
// Configuration dans Stripe Dashboard :
// 1. Aller sur https://dashboard.stripe.com/webhooks
// 2. Cliquer sur "Ajouter un endpoint"
// 3. URL : https://boutique.la-mug.com/api/webhook
// 4. Sélectionner l'événement : checkout.session.completed
// 5. Copier le "Signing secret" (whsec_...) et l'ajouter
//    dans les variables d'environnement Vercel sous STRIPE_WEBHOOK_SECRET
//
// En local (pour tester) :
//   stripe listen --forward-to localhost:3000/api/webhook
//
// Variables d'environnement requises :
//   - NEXT_PUBLIC_SUPABASE_URL
//   - SUPABASE_SERVICE_ROLE_KEY
//   - STRIPE_WEBHOOK_SECRET (optionnel mais recommandé en production)
//   - RESEND_API_KEY (optionnel — si absent, l'email de confirmation est ignoré)
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const customerEmail = session.customer_details?.email ?? "unknown";
      const customerName = session.customer_details?.name ?? "unknown";
      const amountTotal = session.amount_total ?? 0;

      // Enregistrer la commande
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_email: customerEmail,
          customer_name: customerName,
          shipping_address: JSON.stringify(session.shipping_details?.address ?? {}),
          total: amountTotal,
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

      // Extraire les line items pour l'email de confirmation
      const lineItems: string[] = [];
      if (session.line_items?.data) {
        for (const item of session.line_items.data) {
          const qty = item.quantity ?? 1;
          const description = item.description ?? item.price?.product?.name ?? "Article";
          lineItems.push(`${description} x${qty}`);
        }
      } else if (session.metadata?.product_names) {
        // Fallback : noms de produits passés via metadata
        lineItems.push(...session.metadata.product_names.split(","));
      }

      // Formater le total en euros (les montants Stripe sont en centimes)
      const totalFormatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: session.currency?.toUpperCase() ?? "EUR",
      }).format(amountTotal / 100);

      console.log("Order details:", {
        email: customerEmail,
        name: customerName,
        items: lineItems,
        total: totalFormatted,
        sessionId: session.id,
      });

      // Envoyer l'email de confirmation (ignoré si RESEND_API_KEY n'est pas défini)
      try {
        await sendOrderConfirmation(
          customerEmail,
          customerName,
          lineItems.length > 0 ? lineItems : ["Commande confirmée"],
          totalFormatted,
          session.id
        );
        console.log("Confirmation email sent to:", customerEmail);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Ne pas échouer le webhook si l'email échoue
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
