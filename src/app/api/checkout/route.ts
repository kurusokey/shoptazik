import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shoptazik.vercel.app";

  try {
    const body = await req.json();
    const { items, tracks } = body;

    const hasItems = items && items.length > 0;
    const hasTracks = tracks && tracks.length > 0;

    if (!hasItems && !hasTracks) {
      return NextResponse.json({ error: "Le panier est vide" }, { status: 400 });
    }

    if (!stripeSecretKey) {
      return NextResponse.json({
        error: "Stripe non configuré",
        debug: "STRIPE_SECRET_KEY is missing",
      }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey);
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (hasItems) {
      for (const item of items) {
        line_items.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.product.name,
              description: item.variant
                ? `${item.product.description} — ${item.variant.label}`
                : (item.product.description || "Produit Shoptazik"),
            },
            unit_amount: item.product.price + (item.variant?.price_modifier ?? 0),
          },
          quantity: item.quantity,
        });
      }
    }

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

    if (!isDigitalOnly) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ["FR", "BE", "CH", "LU", "MC", "GP", "MQ", "RE", "GF"],
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Checkout error:", message);
    return NextResponse.json(
      { error: "Erreur lors du checkout", debug: message, hasKey: !!stripeSecretKey },
      { status: 500 }
    );
  }
}
