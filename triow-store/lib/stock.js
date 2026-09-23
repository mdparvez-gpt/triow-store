import { SIZES } from '@/lib/config';

export const totalStock = (p) => SIZES.reduce((sum, s) => sum + (Number(p.stock?.[s]) || 0), 0);

/** Units available for one size. A manual "out of stock" override wins over counts. */
export const sizeStock = (p, size) => (p.outOfStock ? 0 : Number(p.stock?.[size]) || 0);

/** 'in' | 'low' | 'out' */
export function stockStatus(p) {
  const total = totalStock(p);
  if (p.outOfStock || total <= 0) return 'out';
  if (total <= (p.lowStockThreshold ?? 5)) return 'low';
  return 'in';
}

export const STATUS_META = {
  in: { label: 'In stock', dot: 'bg-emerald-400', text: 'text-emerald-300' },
  low: { label: 'Low stock', dot: 'bg-amber-400', text: 'text-amber-300' },
  out: { label: 'Out of stock', dot: 'bg-red-400', text: 'text-red-300' },
};
