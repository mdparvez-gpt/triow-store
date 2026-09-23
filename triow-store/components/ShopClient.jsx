'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useProductFilters } from '@/hooks/useProductFilters';
import { CATEGORIES, categoryLabel } from '@/lib/config';
import { cn } from '@/lib/utils';
import BudgetFilter from '@/components/BudgetFilter';
import ProductGrid from '@/components/ProductGrid';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

const num = (v) => (v === null || v === '' ? NaN : Number(v));

export default function ShopClient() {
  const { products } = useStore();
  const params = useSearchParams();
  const f = useProductFilters(products, {
    min: num(params.get('min')),
    max: num(params.get('max')),
    category: params.get('category') || 'all',
    sort: params.get('sort') || 'featured',
    q: params.get('q') || '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Header links change the query string without remounting this page, so re-apply it.
  const paramsKey = params.toString();
  useEffect(() => {
    const cat = params.get('category') || 'all';
    f.setCategory(CATEGORIES.some((c) => c.slug === cat) ? cat : 'all');
    f.setSort(SORTS.some((s) => s.value === params.get('sort')) ? params.get('sort') : 'featured');
    f.setQuery(params.get('q') || '');
    const mn = num(params.get('min'));
    const mx = num(params.get('max'));
    if (Number.isNaN(mn) && Number.isNaN(mx)) f.resetBudget();
    else f.setValue([Number.isNaN(mn) ? f.bounds.min : mn, Number.isNaN(mx) ? f.bounds.max : mx]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  const title = f.category === 'all' ? 'All products' : categoryLabel(f.category);

  return (
    <div className="container-x py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {f.query && (
          <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
            Results for “{f.query}”
            <button type="button" onClick={() => f.setQuery('')} className="inline-flex items-center gap-1 text-gold hover:text-gold-light">
              <X size={14} /> Clear
            </button>
          </p>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
        <button type="button" onClick={() => setShowFilters((v) => !v)} className="btn btn-ghost px-4 py-2.5" aria-expanded={showFilters}>
          <SlidersHorizontal size={16} /> Filters and budget
        </button>
        <p className="text-sm text-white/60">{f.filtered.length} items</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[19rem_1fr]">
        <aside className={cn('space-y-6 lg:sticky lg:top-28 lg:block lg:self-start', showFilters ? 'block' : 'hidden')} aria-label="Filters">
          <BudgetFilter
            prices={f.pool.map((p) => p.price)}
            bounds={f.bounds}
            value={f.value}
            onChange={f.setValue}
            onReset={f.resetBudget}
            active={f.budgetActive}
            matchCount={f.filtered.length}
            className="!p-5"
          />

          <div className="card p-5">
            <h2 className="font-sans text-sm font-semibold text-white">Category</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {[{ slug: 'all', label: 'All' }, ...CATEGORIES].map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => f.setCategory(c.slug)}
                  aria-pressed={f.category === c.slug}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-xs transition',
                    f.category === c.slug
                      ? 'border-gold bg-gold text-ink'
                      : 'border-white/20 text-white/75 hover:border-gold hover:text-gold'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-white/80">
              <input
                type="checkbox"
                checked={f.inStockOnly}
                onChange={(e) => f.setInStockOnly(e.target.checked)}
                className="h-4 w-4 accent-[#D4AF37]"
              />
              Hide sold out items
            </label>
          </div>
        </aside>

        <section aria-label="Products">
          <div className="mb-6 hidden items-center justify-between lg:flex">
            <p className="text-sm text-white/60" aria-live="polite">
              {f.filtered.length} {f.filtered.length === 1 ? 'item' : 'items'}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-white/60">Sort by</label>
              <select id="sort" value={f.sort} onChange={(e) => f.setSort(e.target.value)} className="field !w-auto !py-2">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-6 lg:hidden">
            <label htmlFor="sort-m" className="sr-only">Sort by</label>
            <select id="sort-m" value={f.sort} onChange={(e) => f.setSort(e.target.value)} className="field">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>Sort: {s.label}</option>
              ))}
            </select>
          </div>

          <ProductGrid
            products={f.filtered}
            skeletonCount={8}
            empty={
              <div className="card grid place-items-center px-6 py-20 text-center">
                <p className="font-serif text-3xl text-white">No matches</p>
                <p className="mt-2 max-w-sm text-sm text-mist/70">
                  Nothing fits these filters. Widen your budget or clear the search to see more.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    f.resetBudget();
                    f.setCategory('all');
                    f.setQuery('');
                    f.setInStockOnly(false);
                  }}
                  className="btn btn-gold mt-6"
                >
                  Clear all filters
                </button>
              </div>
            }
          />
        </section>
      </div>
    </div>
  );
}
