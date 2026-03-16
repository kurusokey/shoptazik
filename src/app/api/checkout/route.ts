import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, tracks } = body;

    const hasItems = items && items.length > 0;
    const hasTracks = tracks && tracks.length > 0;

    if (!hasItems && !hasTracks) {
      return NextResponse.json({ error: "Le panier est vide" }, { status: 400 });
    }

    // Lire la clé au runtime (pas au build time)
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shoptazik.vercel.app";

    if (!stripeSecretKey) {
      return NextResponse.json({
        url: null,
        success: true,
        message: "Stripe non configuré",
      });
    }

    const stripe = new Stripe(stripeSecretKey);
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Produits physiques (vinyle, CD, merch)
    if (hasItems) {
      for (const item of items) {
        line_items.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.product.name,
              description: item.variant
                ? `${item.product.description} — ${item.variant.label}`
                : item.product.description,
            },
            unit_amount: item.product.price + (item.variant?.price_modifier ?? 0),
          },
          quantity: item.quantity,
        });
      }
    }

    // Tracks digitaux (achat à l'unité)
    if (hasTracks) {
      for (const track of tracks) {
        line_items.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: `${track.title} — ${track.artist}`,
              description: `Téléchargement digital — ${track.album}`,
            },
            unit_amount: track.price,
          },
          quantity: 1,
        });
      }
    }

    const isDigitalOnly = !hasItems && hasTracks;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      locale: "fr",
    };

    // Adresse de livraison uniquement pour les produits physiques
    if (!isDigitalOnly) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ["FR", "BE", "CH", "LU", "MC", "GP", "MQ", "RE", "GF"],
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors du checkout" },
      { status: 500 }
    );
  }
}
