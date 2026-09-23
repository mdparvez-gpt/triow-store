'use client';

import Link from 'next/link';
import { useStore } from '@/hooks/useStore';
import { useProductFilters } from '@/hooks/useProductFilters';
import BudgetFilter from '@/components/BudgetFilter';
import ProductGrid from '@/components/ProductGrid';

/** Homepage version of the Smart Budget Filter with a live preview of matching products. */
export default function BudgetSection() {
  const { products } = useStore();
  const f = useProductFilters(products);
  const params = new URLSearchParams();
  params.set('min', String(f.value[0]));
  params.set('max', String(f.value[1]));

  return (
    <section id="budget" className="container-x scroll-mt-24 pt-20 sm:pt-28" aria-labelledby="budget-heading">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-14">
        <div>
          <h2 id="budget-heading" className="text-3xl sm:text-4xl">
            Start with what you want to spend
          </h2>
          <p className="mb-6 mt-2 max-w-md text-sm leading-relaxed text-mist/80 sm:text-base">
            Drag the handles or type a range. The pieces on the right update as you go.
          </p>
          <BudgetFilter
            prices={products.map((p) => p.price)}
            bounds={f.bounds}
            value={f.value}
            onChange={f.setValue}
            onReset={f.resetBudget}
            active={f.budgetActive}
            matchCount={f.filtered.length}
          />
        </div>

        <div>
          <ProductGrid
            products={f.filtered.slice(0, 6)}
            skeletonCount={6}
            empty={
              <div className="card grid place-items-center px-6 py-16 text-center">
                <p className="font-serif text-2xl text-white">Nothing in this range yet</p>
                <p className="mt-2 max-w-xs text-sm text-mist/70">Widen the budget, or reset it to see everything.</p>
                <button type="button" onClick={f.resetBudget} className="btn btn-ghost mt-5">
                  Reset budget
                </button>
              </div>
            }
          />
          {f.filtered.length > 6 && (
            <div className="mt-8 text-center">
              <Link href={`/shop?${params.toString()}`} className="btn btn-ghost">
                See all {f.filtered.length} in the shop
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
