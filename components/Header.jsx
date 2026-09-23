"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Header({ onOpenCart }) {
  const { cart, isMounted } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = isMounted
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-black text-xs font-semibold text-center py-1.5 uppercase tracking-wider">
        Free Shipping Nationwide on Orders Over ৳2500
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-zinc-300 hover:text-white"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="text-2xl font-black tracking-widest text-white">
            TRI<span className="text-amber-500">OW</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <Link href="/shop" className="hover:text-amber-400 transition">Shop</Link>
          <Link href="/#categories" className="hover:text-amber-400 transition">Categories</Link>
          <Link href="/admin" className="hover:text-amber-400 transition">Admin Panel</Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-5">
          <Link href="/admin" className="text-zinc-300 hover:text-white">
            <User size={20} />
          </Link>
          <button
            onClick={onOpenCart}
            className="relative text-zinc-300 hover:text-white transition"
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-black font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-4 space-y-3">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block text-zinc-200">Home</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="block text-zinc-200">Shop</Link>
          <Link href="/admin" onClick={() => setMenuOpen(false)} className="block text-zinc-200">Admin Panel</Link>
        </div>
      )}
    </header>
  );
}
