"use client";

import { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

const initialProducts = [
  {
    id: "1",
    name: "TRIOW Premium Heavyweight Tee",
    category: "Men",
    price: 1250,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
    description: "100% Organic Heavyweight Cotton T-shirt with signature minimal styling."
  },
  {
    id: "2",
    name: "TRIOW Minimalist Oversized Hoodie",
    category: "Outerwear",
    price: 2850,
    sizes: ["M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
    description: "Ultra-soft fleece oversized hoodie designed for supreme warmth."
  }
];

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("triow_cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("triow_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product, size) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  return (
    <StoreContext.Provider value={{ products, setProducts, cart, addToCart, removeFromCart, isMounted }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
