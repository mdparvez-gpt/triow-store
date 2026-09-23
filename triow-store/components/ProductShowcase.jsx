'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/hooks/useStore';
import ProductGrid from '@/components/ProductGrid';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'best', label: 'Best sellers', href: '/shop?sort=featured' },
  { id: 'new', label: 'New arrivals', href: '/shop?sort=newest' },
];

export default function ProductShowcase() {
  const { products } = useStore();
  const [tab, setTab] = useState('best');

  const items = useMemo(() => {
    const list =
      tab === 'best'
        ? products.filter((p) => p.bestSeller).sort((a, b) => b.reviews - a.reviews)
        : products.filter((p) => p.newArrival).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list.slice(0, 8);
  }, [products, tab]);

  return (
    <section className="container-x pt-20 sm:pt-28" aria-labelledby="showcase-heading">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <div>
          <h2 id="showcase-heading" className="text-3xl sm:text-4xl">
            What people are wearing
          </h2>
          <p className="mt-2 max-w-md text-sm text-mist/80 sm:text-base">
            Hover a card to preview the back and add your size without leaving the page.
          </p>
        </div>
        <div role="tablist" aria-label="Product lists" className="flex gap-1 rounded-full border border-white/10 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm transition',
                tab === t.id ? 'text-ink' : 'text-white/70 hover:text-white'
              )}
            >
              {tab === t.id && (
                <motion.span layoutId="showcase-tab" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <ProductGrid products={items} skeletonCount={4} />
    </section>
  );
}
