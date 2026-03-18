"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

interface TshirtProductPageProps {
  product: Product;
  variants: ProductVariant[];
}

export default function TshirtProductPage({
  product,
  variants,
}: TshirtProductPageProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [added, setAdded] = useState(false);

  const sizeVariants = variants
    .filter((v) => v.type === "size")
    .sort((a, b) => {
      const order = ["S", "M", "L", "XL", "XXL"];
      const aIdx = order.findIndex((s) => a.label.includes(s));
      const bIdx = order.findIndex((s) => b.label.includes(s));
      return aIdx - bIdx;
    });

  const finalPrice = product.price + (selectedVariant?.price_modifier ?? 0);
  const inStock = selectedVariant
    ? selectedVariant.stock > 0
    : product.stock > 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ background: "#1A1610" }}>
      {/* Hero section with blurred background */}
      <section className="relative overflow-hidden px-4 py-10 md:py-16">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={product.image_url}
            alt=""
            fill={true}
            className="scale-125 object-cover blur-[80px]"
            style={{ opacity: 0.1 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(26,22,16,0.85)" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-white/40 md:mb-8 md:gap-2 md:text-sm">
            <Link href="/" className="transition hover:text-white/60">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-white/40">Produits</span>
            <span>/</span>
            <span style={{ color: "#C8A050" }}>{product.name}</span>
          </nav>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Product image */}
            <div className="flex items-start justify-center">
              <div
                className="w-full max-w-[500px] overflow-hidden rounded-xl"
                style={{
                  boxShadow:
                    "0 30px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
                }}
              >
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={600}
                  height={600}
                  priority={true}
                  className="block h-auto w-full"
                />
              </div>
            </div>

            {/* Product details */}
            <div className="flex flex-col justify-center">
              <span
                className="inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(200,160,80,0.1)",
                  color: "#C8A050",
                }}
              >
                T-shirt
              </span>

              <h1 className="mt-3 text-2xl font-black text-white md:text-4xl">
                {product.name}
              </h1>

              <p className="mt-4 leading-relaxed text-white/50">
                {product.description}
              </p>

              {/* Price */}
              <div className="mt-6">
                <span className="text-3xl font-bold text-white">
                  {formatPrice(finalPrice)}
                </span>
                {product.edition_info && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "#C8A050" }}
                  >
                    {product.edition_info}
                  </p>
                )}
              </div>

              {/* Size selection */}
              {sizeVariants.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold text-white/70">
                    Taille
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizeVariants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const isOutOfStock = variant.stock === 0;

                      return (
                        <button
                          key={variant.id}
                          onClick={() =>
                            !isOutOfStock && setSelectedVariant(variant)
                          }
                          disabled={isOutOfStock}
                          className="relative rounded-lg px-4 py-2.5 text-sm font-semibold transition"
                          style={{
                            background: isSelected
                              ? "rgba(200,160,80,0.2)"
                              : "rgba(255,255,255,0.05)",
                            border: isSelected
                              ? "2px solid #C8A050"
                              : "2px solid rgba(255,255,255,0.08)",
                            color: isOutOfStock
                              ? "rgba(255,255,255,0.2)"
                              : isSelected
                                ? "#C8A050"
                                : "rgba(255,255,255,0.7)",
                            cursor: isOutOfStock ? "not-allowed" : "pointer",
                            opacity: isOutOfStock ? 0.5 : 1,
                          }}
                        >
                          {variant.label}
                          {isOutOfStock && (
                            <span
                              className="absolute inset-0 flex items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-wider"
                              style={{
                                background: "rgba(26,22,16,0.7)",
                                color: "rgba(255,255,255,0.3)",
                              }}
                            >
                              Rupture
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to cart */}
              <div className="mt-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || !inStock}
                  className="w-full rounded-xl px-8 py-4 text-base font-bold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
                  style={{
                    background:
                      selectedVariant && inStock
                        ? "linear-gradient(135deg, #C8A050, #A08030)"
                        : "rgba(255,255,255,0.1)",
                    color:
                      selectedVariant && inStock
                        ? "#1A1610"
                        : "rgba(255,255,255,0.4)",
                    boxShadow:
                      selectedVariant && inStock
                        ? "0 6px 25px rgba(200,160,80,0.3)"
                        : "none",
                  }}
                >
                  {!selectedVariant
                    ? "Choisir une taille"
                    : !inStock
                      ? "Rupture de stock"
                      : added
                        ? "Ajout\u00e9 au panier !"
                        : "Ajouter au panier"}
                </button>
              </div>

              {/* Stock info */}
              {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 10 && (
                <p
                  className="mt-3 text-xs font-medium"
                  style={{ color: "#D41920" }}
                >
                  Plus que {selectedVariant.stock} en stock
                </p>
              )}

              {/* Shipping */}
              <p className="mt-4 text-xs text-white/20">
                Livraison : {product.shipping_delay}
              </p>

              {product.is_limited && (
                <p
                  className="mt-2 text-xs font-semibold"
                  style={{ color: "#C8A050" }}
                >
                  \u00c9dition limit\u00e9e
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
