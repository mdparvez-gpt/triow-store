'use client';

import { useStore } from '@/hooks/useStore';
import ProductCard from '@/components/ProductCard';

export function ProductSkeletons({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[5/6]" />
          <div className="skeleton mt-3 h-4 w-3/4 !rounded-md" />
          <div className="skeleton mt-2 h-4 w-1/3 !rounded-md" />
        </div>
      ))}
    </>
  );
}

export default function ProductGrid({ products, skeletonCount = 4, empty }) {
  const { ready } = useStore();

  if (ready && products.length === 0) {
    return empty || <p className="py-10 text-center text-sm text-white/60">No products to show yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
      {!ready ? <ProductSkeletons count={skeletonCount} /> : products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
