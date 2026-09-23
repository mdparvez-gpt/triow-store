"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function ProductCard({ product }) {
  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <span className="absolute top-2 left-2 bg-black/70 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            {product.category}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-zinc-100 line-clamp-1 group-hover:text-amber-400 transition">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-amber-500 mt-1">৳{product.price}</p>

          {/* Size Selector */}
          <div className="mt-3">
            <span className="text-xs text-zinc-400 block mb-1.5">Select Size:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`text-xs px-2.5 py-1 rounded font-medium border transition ${
                    selectedSize === sz
                      ? "bg-amber-500 text-black border-amber-500 font-bold"
                      : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-lg text-sm font-bold transition ${
            added
              ? "bg-green-600 text-white"
              : "bg-zinc-800 hover:bg-amber-500 hover:text-black text-white"
          }`}
        >
          {added ? "Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
