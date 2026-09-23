"use client";
import { useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function ShopPage() {
  const { products } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState("All");

  const filtered = selectedCat === "All" ? products : products.filter(p => p.category === selectedCat);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header onOpenCart={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-6 uppercase">All Products</h1>
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["All", "Men", "Women", "Outerwear"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${selectedCat === cat ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-300"}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>
    </div>
  );
}
