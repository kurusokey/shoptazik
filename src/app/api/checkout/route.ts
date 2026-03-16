import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

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
      return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 });
    }

    // Construire les line_items pour l'API Stripe
    const line_items: Array<{
      price_data: {
        currency: string;
        product_data: { name: string; description: string };
        unit_amount: number;
      };
      quantity: number;
    }> = [];

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

    // Appel direct à l'API Stripe via fetch
    const params: string[] = [];
    const add = (key: string, value: string) => {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    };

    add("mode", "payment");
    add("locale", "fr");

    // Les URLs Stripe doivent garder {CHECKOUT_SESSION_ID} tel quel
    params.push(`success_url=${encodeURIComponent(`${baseUrl}/checkout/success`)}%3Fsession_id%3D%7BCHECKOUT_SESSION_ID%7D`);
    params.push(`cancel_url=${encodeURIComponent(`${baseUrl}/cart`)}`);

    line_items.forEach((item, i) => {
      add(`line_items[${i}][price_data][currency]`, item.price_data.currency);
      add(`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name);
      add(`line_items[${i}][price_data][product_data][description]`, item.price_data.product_data.description);
      add(`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount));
      add(`line_items[${i}][quantity]`, String(item.quantity));
    });

    if (!isDigitalOnly) {
      ["FR", "BE", "CH", "LU", "MC", "GP", "MQ", "RE", "GF"].forEach((c, i) => {
        add(`shipping_address_collection[allowed_countries][${i}]`, c);
      });
    }

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.join("&"),
    });

    const session = await response.json();

    if (!response.ok) {
      console.error("Stripe API error:", session);
      return NextResponse.json(
        { error: "Erreur Stripe", debug: session.error?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Checkout error:", message);
    return NextResponse.json(
      { error: "Erreur lors du checkout", debug: message },
      { status: 500 }
    );
  }
}
