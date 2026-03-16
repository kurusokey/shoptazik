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
    const successUrl = `https://shoptazik.vercel.app/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `https://shoptazik.vercel.app/cart`;

    const formParts: string[] = [
      `mode=payment`,
      `locale=fr`,
      `success_url=${encodeURIComponent(successUrl)}`,
      `cancel_url=${encodeURIComponent(cancelUrl)}`,
    ];

    line_items.forEach((item, i) => {
      const p = `line_items[${i}]`;
      formParts.push(`${encodeURIComponent(`${p}[price_data][currency]`)}=eur`);
      formParts.push(`${encodeURIComponent(`${p}[price_data][product_data][name]`)}=${encodeURIComponent(item.price_data.product_data.name)}`);
      formParts.push(`${encodeURIComponent(`${p}[price_data][product_data][description]`)}=${encodeURIComponent(item.price_data.product_data.description)}`);
      formParts.push(`${encodeURIComponent(`${p}[price_data][unit_amount]`)}=${item.price_data.unit_amount}`);
      formParts.push(`${encodeURIComponent(`${p}[quantity]`)}=${item.quantity}`);
    });

    if (!isDigitalOnly) {
      ["FR", "BE", "CH", "LU", "MC", "GP", "MQ", "RE", "GF"].forEach((c, i) => {
        formParts.push(`${encodeURIComponent(`shipping_address_collection[allowed_countries][${i}]`)}=${c}`);
      });
    }

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formParts.join("&"),
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
