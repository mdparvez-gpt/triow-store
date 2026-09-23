'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useEscape } from '@/hooks/useEscape';
import { useLockBody } from '@/hooks/useLockBody';
import { getProductImages } from '@/lib/garment';
import { categoryLabel } from '@/lib/config';
import { formatBDT } from '@/lib/utils';

export default function SearchOverlay({ open, onClose }) {
  const { products } = useStore();
  const router = useRouter();
  const inputRef = useRef(null);
  const [q, setQ] = useState('');

  useLockBody(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (open) {
      setQ('');
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) => `${p.title} ${p.colorName} ${categoryLabel(p.category)}`.toLowerCase().includes(term))
      .slice(0, 5);
  }, [q, products]);

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    onClose();
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-ink/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="container-x pt-6 sm:pt-10">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-3">
                <form onSubmit={submit} className="glass flex flex-1 items-center gap-3 rounded-full px-5">
                  <Search size={18} className="text-gold" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search tees, polos, hoodies"
                    aria-label="Search products"
                    className="h-12 w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
                  />
                </form>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="grid h-11 w-11 place-items-center rounded-full text-white transition hover:text-gold"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mt-6">
                {q.trim() && results.length === 0 && (
                  <p className="px-2 text-sm text-white/60">
                    No products match “{q.trim()}”. Try a colour or category, like “olive” or “polo”.
                  </p>
                )}
                <ul className="flex flex-col gap-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={onClose}
                        className="glass flex items-center gap-4 rounded-2xl p-3 transition hover:border-gold/50"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getProductImages(p)[0]} alt="" className="h-16 w-14 rounded-lg object-cover" />
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-white">{p.title}</span>
                          <span className="text-xs text-white/50">{categoryLabel(p.category)}</span>
                        </span>
                        <span className="text-sm text-gold-light">{formatBDT(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {results.length > 0 && (
                  <button type="button" onClick={submit} className="mt-4 px-2 text-sm text-gold hover:text-gold-light">
                    See all results for “{q.trim()}”
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
