"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, ProductVariant } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant) => {
        const items = get().items;
        const existing = items.find(
          (item) =>
            item.product.id === product.id &&
            item.variant?.id === variant?.id
        );

        if (existing) {
          set({
            items: items.map((item) =>
              item.product.id === product.id && item.variant?.id === variant?.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, variant, quantity: 1 }] });
        }
      },

      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (item) =>
              !(item.product.id === productId && item.variant?.id === variantId)
          ),
        });
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId && item.variant?.id === variantId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) =>
            sum +
            (item.product.price + (item.variant?.price_modifier ?? 0)) *
              item.quantity,
          0
        ),
    }),
    { name: "lamug-boutik-cart" }
  )
);
