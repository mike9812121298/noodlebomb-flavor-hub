import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  purchaseType: "one-time" | "subscribe";
}

const CART_KEY = "nb_cart_v1";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.slug === item.slug && i.purchaseType === item.purchaseType
        );
        if (existing) {
          return prev.map((i) =>
            i.slug === item.slug && i.purchaseType === item.purchaseType
              ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
              : i
          );
        }
        return [...prev, { ...item, quantity: item.quantity ?? 1 }];
      });
    },
    []
  );

  const removeItem = useCallback((slug: string, purchaseType: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.slug === slug && i.purchaseType === purchaseType))
    );
  }, []);

  const updateQuantity = useCallback(
    (slug: string, purchaseType: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter(
            (i) => !(i.slug === slug && i.purchaseType === purchaseType)
          )
        );
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.slug === slug && i.purchaseType === purchaseType
              ? { ...i, quantity }
              : i
          )
        );
      }
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const freeShipping = subtotal >= 40;

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
    freeShipping,
  };
}
