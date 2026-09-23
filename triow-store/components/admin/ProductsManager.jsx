'use client';

import { useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { SIZES, categoryLabel } from '@/lib/config';
import { getProductImages } from '@/lib/garment';
import { STATUS_META, stockStatus, totalStock } from '@/lib/stock';
import { cn, formatBDT } from '@/lib/utils';
import ProductForm from '@/components/admin/ProductForm';

export default function ProductsManager() {
  const { products, setSizeStock, toggleOutOfStock, deleteProduct } = useStore();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null); // product | 'new' | null

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? products.filter((p) => `${p.title} ${categoryLabel(p.category)}`.toLowerCase().includes(term)) : products;
  }, [products, q]);

  const remove = (p) => {
    if (window.confirm(`Delete “${p.title}”? This removes it from the storefront.`)) deleteProduct(p.id);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl">Products</h1>
        <button type="button" onClick={() => setEditing('new')} className="btn btn-gold px-5 py-2.5">
          <Plus size={16} /> Add product
        </button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products"
          aria-label="Search products"
          className="field !pl-10"
        />
      </div>

      <p className="mt-4 text-xs text-white/50">
        Edit stock counts directly in the table. Changes appear on the storefront immediately.
      </p>

      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-white/10 text-xs text-white/50">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Product</th>
              <th scope="col" className="px-4 py-3 font-medium">Price</th>
              <th scope="col" className="px-4 py-3 font-medium">Stock by size</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.07]">
            {list.map((p) => {
              const status = stockStatus(p);
              const meta = STATUS_META[status];
              return (
                <tr key={p.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getProductImages(p)[0]} alt="" className="h-14 w-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-white">{p.title}</p>
                        <p className="text-xs text-white/50">{categoryLabel(p.category)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white">{formatBDT(p.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {SIZES.map((s) => (
                        <label key={s} className="text-center">
                          <span className="block text-[10px] text-white/40">{s}</span>
                          <input
                            type="number"
                            min="0"
                            value={p.stock?.[s] ?? 0}
                            onChange={(e) => setSizeStock(p.id, s, e.target.value)}
                            aria-label={`${p.title} stock for size ${s}`}
                            className="w-12 rounded-lg border border-white/10 bg-ink px-1.5 py-1.5 text-center text-xs text-white focus:border-gold focus:outline-none"
                          />
                        </label>
                      ))}
                    </div>
                    <p className="mt-1 text-[11px] text-white/40">{totalStock(p)} total, low at {p.lowStockThreshold ?? 5}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center gap-2 text-xs', meta.text)}>
                      <span className={cn('h-2 w-2 rounded-full', meta.dot)} /> {meta.label}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!p.outOfStock}
                      aria-label={`${p.title} available for sale`}
                      onClick={() => toggleOutOfStock(p.id)}
                      className="mt-2 flex items-center gap-2 text-[11px] text-white/60"
                    >
                      <span className={cn('relative h-5 w-9 rounded-full transition', p.outOfStock ? 'bg-white/20' : 'bg-gold')}>
                        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', p.outOfStock ? 'left-0.5' : 'left-[1.15rem]')} />
                      </span>
                      {p.outOfStock ? 'Marked sold out' : 'On sale'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => setEditing(p)} aria-label={`Edit ${p.title}`} className="grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-gold"><Pencil size={16} /></button>
                      <button type="button" onClick={() => remove(p)} aria-label={`Delete ${p.title}`} className="grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && <p className="px-4 py-10 text-center text-sm text-white/60">No products match that search.</p>}
      </div>

      {editing && <ProductForm product={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
