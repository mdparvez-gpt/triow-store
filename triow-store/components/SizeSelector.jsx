'use client';

import { SIZES } from '@/lib/config';
import { sizeStock } from '@/lib/stock';
import { cn } from '@/lib/utils';

export default function SizeSelector({ product, value, onChange }) {
  const threshold = product.lowStockThreshold ?? 5;
  const left = value ? sizeStock(product, value) : null;

  return (
    <fieldset>
      <legend className="mb-3 flex w-full items-center justify-between text-sm text-white">
        <span>Size</span>
        {left !== null && (
          <span className={cn('text-xs', left <= threshold ? 'text-amber-300' : 'text-emerald-300')}>
            {left <= threshold ? `Only ${left} left in ${value}` : `${value} is in stock`}
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {SIZES.map((s) => {
          const n = sizeStock(product, s);
          const out = n <= 0;
          return (
            <label key={s} className={cn('relative', out && 'cursor-not-allowed')}>
              <input
                type="radio"
                name="size"
                value={s}
                disabled={out}
                checked={value === s}
                onChange={() => onChange(s)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'grid h-12 min-w-14 cursor-pointer place-items-center rounded-xl border px-4 text-sm transition',
                  'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-light',
                  out
                    ? 'cursor-not-allowed border-white/10 text-white/25 line-through'
                    : value === s
                    ? 'border-gold bg-gold text-ink'
                    : 'border-white/20 text-white hover:border-gold'
                )}
              >
                {s}
              </span>
              {!out && n <= threshold && value !== s && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-ink" aria-hidden="true" />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
