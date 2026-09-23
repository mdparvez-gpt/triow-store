'use client';

import { useMemo, useState } from 'react';
import { BUDGET, CATEGORIES } from '@/lib/config';
import { stockStatus } from '@/lib/stock';

const SORTERS = {
  featured: (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || Number(b.featured) - Number(a.featured) || b.reviews - a.reviews,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

/**
 * Powers the Smart Budget Filter plus category / search / sort.
 * `range` holds explicit user picks; null means "use the full bounds".
 */
export function useProductFilters(products, initial = {}) {
  const bounds = useMemo(() => {
    const top = products.reduce((m, p) => Math.max(m, p.price), 0);
    return { min: BUDGET.min, max: Math.max(BUDGET.max, Math.ceil(top / 500) * 500) };
  }, [products]);

  const [range, setRange] = useState({
    min: Number.isFinite(initial.min) ? initial.min : null,
    max: Number.isFinite(initial.max) ? initial.max : null,
  });
  const [category, setCategory] = useState(
    CATEGORIES.some((c) => c.slug === initial.category) ? initial.category : 'all'
  );
  const [sort, setSort] = useState(SORTERS[initial.sort] ? initial.sort : 'featured');
  const [query, setQuery] = useState(initial.q || '');
  const [inStockOnly, setInStockOnly] = useState(false);

  const value = [range.min ?? bounds.min, range.max ?? bounds.max];
  const budgetActive = range.min !== null || range.max !== null;

  // Everything except the price range, used to draw the price histogram.
  const pool = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (inStockOnly && stockStatus(p) === 'out') return false;
      if (q && !`${p.title} ${p.colorName} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, category, query, inStockOnly]);

  const filtered = useMemo(
    () => pool.filter((p) => p.price >= value[0] && p.price <= value[1]).sort(SORTERS[sort]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pool, value[0], value[1], sort]
  );

  return {
    bounds,
    value,
    setValue: ([min, max]) => setRange({ min, max }),
    resetBudget: () => setRange({ min: null, max: null }),
    budgetActive,
    category, setCategory,
    sort, setSort,
    query, setQuery,
    inStockOnly, setInStockOnly,
    pool,
    filtered,
  };
}
