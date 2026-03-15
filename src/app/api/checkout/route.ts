import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Le panier est vide" },
        { status: 400 }
      );
    }

    // Si Stripe est configuré, on crée une vraie session
    if (stripeSecretKey) {
      const stripe = new Stripe(stripeSecretKey);

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
        items.map(
          (item: {
            product: { name: string; price: number; description: string };
            variant?: { price_modifier: number; label: string };
            quantity: number;
          }) => ({
            price_data: {
              currency: "eur",
              product_data: {
                name: item.product.name,
                description: item.variant
                  ? `${item.product.description} — ${item.variant.label}`
                  : item.product.description,
              },
              unit_amount:
                item.product.price + (item.variant?.price_modifier ?? 0),
            },
            quantity: item.quantity,
          })
        );

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items,
        shipping_address_collection: {
          allowed_countries: ["FR", "BE", "CH", "LU", "MC", "GP", "MQ", "RE", "GF"],
        },
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        locale: "fr",
      });

      return NextResponse.json({ url: session.url });
    }

    // Fallback : simulation si pas de clé Stripe
    return NextResponse.json({
      url: null,
      success: true,
      message: "Commande simulée (Stripe non configuré)",
      order_id: `ORD-${Date.now()}`,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors du checkout" },
      { status: 500 }
    );
  }
}
