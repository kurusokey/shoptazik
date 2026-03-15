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
    <div className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-600">
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {product.is_limited && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-black">
            Edition limitée
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
          {categoryLabel(product.category)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.edition_info && (
              <p className="text-xs text-amber-400">{product.edition_info}</p>
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            {product.stock > 0 ? "Ajouter" : "Épuisé"}
          </button>
        </div>

        <p className="mt-2 text-xs text-zinc-500">
          Livraison : {product.shipping_delay}
        </p>
        {product.stock > 0 && product.stock <= 20 && (
          <p className="text-xs text-red-400">
            Plus que {product.stock} en stock
          </p>
        )}
      </div>
    </div>
  );
}
