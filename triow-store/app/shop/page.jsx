"use client";

import dynamic from "next/dynamic";

const ShopClient = dynamic(() => import("@/components/ShopClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
      <p className="animate-pulse">Loading Triow Store...</p>
    </div>
  ),
});

export default function ShopPage() {
  return <ShopClient />;
}
