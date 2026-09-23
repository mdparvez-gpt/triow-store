"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function Home() {
  const { products } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Men", "Outerwear"];

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header onOpenCart={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-b from-zinc-900 to-black py-16 px-4 text-center border-b border-zinc-800">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-amber-500 font-semibold text-xs tracking-widest uppercase">
            New Collection 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            ELEVATE YOUR STYLE WITH <span className="text-amber-500">TRIOW</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
            Fabrilife inspired quality, crafted with precision. Premium fabrics designed for everyday comfort and durability.
          </p>
        </div>
      </section>

      {/* Product Section */}
      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="text-xs text-zinc-400 mt-1">Explore our latest streetwear & activewear arrivals</p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "bg-amber-500 text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        © 2026 TRIOW Store. All rights reserved. Designed for excellence.
      </footer>
    </div>
  );
}
