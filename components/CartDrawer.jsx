"use client";

import { X, Trash2, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, isMounted } = useStore();

  if (!isOpen) return null;

  const subtotal = isMounted
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 h-full flex flex-col shadow-2xl border-l border-zinc-800">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-amber-500" size={20} />
            <h2 className="font-bold text-lg">Your Cart</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!isMounted || cart.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              Your cart is empty.
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${item.size}-${index}`} className="flex gap-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-800">
                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-zinc-200">{item.name}</h4>
                  <div className="text-xs text-amber-400 mt-1">Size: {item.size}</div>
                  <div className="text-sm font-semibold mt-1">৳{item.price} × {item.quantity}</div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="text-zinc-500 hover:text-red-400 self-start"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal:</span>
              <span className="text-amber-500">৳{subtotal}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block text-center w-full bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
