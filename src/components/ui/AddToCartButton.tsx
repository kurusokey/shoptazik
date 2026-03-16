"use client";

import { useCartStore } from "@/lib/cart-store";
import { Product } from "@/types";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

export default function AddToCartButton({ product, className, style }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={product.stock === 0}
      className={className}
      style={style}
    >
      {product.stock === 0
        ? "Épuisé"
        : added
          ? "Ajouté !"
          : "Commander"}
    </button>
  );
}
