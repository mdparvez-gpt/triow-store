'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import ProductGrid from '@/components/ProductGrid';

export default function WishlistPage() {
  const { products, wishlist } = useStore();
  const saved = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container-x py-10 sm:py-14">
      <h1 className="text-4xl sm:text-5xl">Wishlist</h1>
      <p className="mb-10 mt-2 text-sm text-white/60">Saved on this device.</p>
      <ProductGrid
        products={saved}
        skeletonCount={4}
        empty={
          <div className="card grid place-items-center px-6 py-20 text-center">
            <Heart className="text-gold" size={28} />
            <p className="mt-4 font-serif text-3xl text-white">Nothing saved yet</p>
            <p className="mt-2 max-w-sm text-sm text-mist/70">Tap the heart on any product and it will wait for you here.</p>
            <Link href="/shop" className="btn btn-gold mt-6">Browse the shop</Link>
          </div>
        }
      />
    </div>
  );
}
