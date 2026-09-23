'use client';

import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { DELIVERY, ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from '@/lib/config';
import { formatBDT, formatDate } from '@/lib/utils';

export default function OrdersManager() {
  const { orders, updateOrder } = useStore();
  const [filter, setFilter] = useState('all');
  const list = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl">Orders</h1>
        <div>
          <label htmlFor="o-filter" className="sr-only">Filter by status</label>
          <select id="o-filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="field !w-auto !py-2">
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[64rem] text-left text-sm">
          <thead className="border-b border-white/10 text-xs text-white/50">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Order</th>
              <th scope="col" className="px-4 py-3 font-medium">Customer and address</th>
              <th scope="col" className="px-4 py-3 font-medium">Items</th>
              <th scope="col" className="px-4 py-3 font-medium">Total</th>
              <th scope="col" className="px-4 py-3 font-medium">Payment</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.07]">
            {list.map((o) => (
              <tr key={o.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-medium text-white">{o.id}</p>
                  <p className="text-xs text-white/50">{formatDate(o.createdAt)}</p>
                </td>
                <td className="max-w-[18rem] px-4 py-4">
                  <p className="text-white">{o.customer.name}</p>
                  <p className="text-xs text-white/60">{o.customer.phone}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">{o.customer.address}</p>
                  <p className="mt-1 text-xs text-gold-light">{DELIVERY[o.zone]?.label}</p>
                  {o.customer.note && <p className="mt-1 text-xs italic text-white/50">Note: {o.customer.note}</p>}
                </td>
                <td className="px-4 py-4 text-xs text-white/70">
                  {o.items.map((i, idx) => (
                    <p key={idx}>{i.qty} × {i.title} ({i.size})</p>
                  ))}
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-gold-light">{formatBDT(o.total)}</p>
                  <p className="text-xs text-white/50">incl. {o.deliveryFee ? formatBDT(o.deliveryFee) : 'free'} delivery</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-xs text-white/70">{PAYMENT_METHODS.find((m) => m.value === o.payment.method)?.label}</p>
                  {o.payment.trxId && <p className="text-[11px] text-white/40">TrxID {o.payment.trxId}</p>}
                  <label className="sr-only" htmlFor={`pay-${o.id}`}>Payment status for {o.id}</label>
                  <select
                    id={`pay-${o.id}`}
                    value={o.payment.status}
                    onChange={(e) => updateOrder(o.id, { payment: { status: e.target.value } })}
                    className="field mt-2 !w-auto !px-3 !py-1.5 !text-xs"
                  >
                    {PAYMENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <label className="sr-only" htmlFor={`st-${o.id}`}>Order status for {o.id}</label>
                  <select
                    id={`st-${o.id}`}
                    value={o.status}
                    disabled={o.status === 'cancelled'}
                    onChange={(e) => updateOrder(o.id, { status: e.target.value })}
                    className="field !w-auto !px-3 !py-1.5 !text-xs"
                  >
                    {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  {o.status === 'cancelled' && <p className="mt-1.5 text-[11px] text-white/40">Stock was restored.</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="px-4 py-10 text-center text-sm text-white/60">No orders with this status.</p>}
      </div>
    </div>
  );
}
