'use client';

import { useStore } from '@/hooks/useStore';
import { stockStatus, totalStock, STATUS_META } from '@/lib/stock';
import { formatBDT, formatDate } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/config';

export default function Overview({ goTo }) {
  const { products, orders } = useStore();
  const live = orders.filter((o) => o.status !== 'cancelled');
  const revenue = live.reduce((n, o) => n + o.total, 0);
  const low = products.filter((p) => stockStatus(p) === 'low');
  const out = products.filter((p) => stockStatus(p) === 'out');

  const stats = [
    { label: 'Revenue (excl. cancelled)', value: formatBDT(revenue) },
    { label: 'Orders', value: orders.length },
    { label: 'Low stock products', value: low.length },
    { label: 'Out of stock products', value: out.length },
  ];

  return (
    <div>
      <h1 className="text-4xl">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-xs text-white/50">{s.label}</p>
            <p className="mt-2 font-serif text-3xl text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="card p-5" aria-labelledby="attn-h">
          <div className="flex items-center justify-between">
            <h2 id="attn-h" className="text-2xl">Needs restocking</h2>
            <button type="button" onClick={() => goTo('products')} className="text-xs text-gold hover:text-gold-light">Manage stock</button>
          </div>
          {low.length + out.length === 0 ? (
            <p className="mt-4 text-sm text-white/60">Every product is well stocked.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/[0.07]">
              {[...out, ...low].slice(0, 8).map((p) => {
                const meta = STATUS_META[stockStatus(p)];
                return (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span className="truncate text-white">{p.title}</span>
                    <span className={`inline-flex shrink-0 items-center gap-2 ${meta.text}`}>
                      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                      {stockStatus(p) === 'low' ? `${totalStock(p)} left` : meta.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card p-5" aria-labelledby="recent-h">
          <div className="flex items-center justify-between">
            <h2 id="recent-h" className="text-2xl">Recent orders</h2>
            <button type="button" onClick={() => goTo('orders')} className="text-xs text-gold hover:text-gold-light">All orders</button>
          </div>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-white/60">No orders yet. New orders from the storefront appear here instantly.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/[0.07]">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span>
                    <span className="block text-white">{o.customer.name}</span>
                    <span className="text-xs text-white/50">{o.id}, {formatDate(o.createdAt)}, {ORDER_STATUSES.find((s) => s.value === o.status)?.label}</span>
                  </span>
                  <span className="shrink-0 text-gold-light">{formatBDT(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
