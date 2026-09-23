"use client";
import { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

const initialProducts = [
  { id: "1", name: "TRIOW Premium Heavyweight Tee", price: 1250, category: "Men", sizes: ["S", "M", "L", "XL", "XXL"], image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800" },
  { id: "2", name: "TRIOW Minimalist Oversized Hoodie", price: 2850, category: "Outerwear", sizes: ["M", "L", "XL"], image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800" },
  { id: "3", name: "TRIOW Classic Casual Shirt", price: 1650, category: "Men", sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800" },
  { id: "4", name: "TRIOW Urban Streetwear Jacket", price: 3200, category: "Outerwear", sizes: ["M", "L", "XL"], image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800" }
];

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("triow_cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("triow_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product, size) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => item.id === product.id && item.size === size ? {...item, quantity: item.quantity + 1} : item);
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
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
