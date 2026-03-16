"use client";

import { Product } from "@/types";
import { formatPrice, categoryLabel } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group overflow-hidden rounded-xl border transition hover:border-white/15" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
      <div className="relative aspect-square overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {product.is_limited && (
          <span className="absolute left-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold text-black" style={{ background: "#C8A050" }}>
            Edition limitée
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs text-white/50" style={{ background: "rgba(0,0,0,0.5)" }}>
          {categoryLabel(product.category)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/40">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.edition_info && (
              <p className="text-xs" style={{ color: "#C8A050" }}>{product.edition_info}</p>
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="rounded-lg px-4 py-2 text-sm font-bold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: product.stock > 0 ? "linear-gradient(135deg, #C8A050, #A08030)" : "rgba(255,255,255,0.1)" }}
          >
            {product.stock > 0 ? "Ajouter" : "Épuisé"}
          </button>
        </div>

        <p className="mt-2 text-xs text-white/20">
          Livraison : {product.shipping_delay}
        </p>
        {product.stock > 0 && product.stock <= 20 && (
          <p className="text-xs font-medium" style={{ color: "#D41920" }}>
            Plus que {product.stock} en stock
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs font-medium" style={{ color: "#D41920" }}>
            Rupture de stock
          </p>
        )}
      </div>
    </div>
  );
}
