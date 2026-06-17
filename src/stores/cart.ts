import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  image: string;
  categoryLabel: string;
  qty: number;
  freeShipping?: boolean;
};

type CartState = {
  items: CartItem[];
  add: (product: Product, size: string, qty?: number) => void;
  updateQty: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product, size, qty = 1) =>
        set((state) => {
          const id = `${product.id}-${size}`;
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id,
                productId: product.id,
                name: product.name,
                size,
                price: product.price,
                image: product.image,
                categoryLabel: product.categoryLabel,
                qty,
                freeShipping: product.freeShipping,
              },
            ],
          };
        }),
      updateQty: (id, delta) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
          ),
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "old-iron-cart" }
  )
);

export const useCartCount = () =>
  useCart((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
