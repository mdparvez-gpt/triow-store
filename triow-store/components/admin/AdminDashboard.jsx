'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Boxes, ClipboardList, ExternalLink, LayoutDashboard, LogOut, RotateCcw } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import Overview from '@/components/admin/Overview';
import ProductsManager from '@/components/admin/ProductsManager';
import OrdersManager from '@/components/admin/OrdersManager';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
];

export default function AdminDashboard({ onLogout }) {
  const { ready, orders, resetDemoData } = useStore();
  const [tab, setTab] = useState('overview');
  const newOrders = orders.filter((o) => o.status === 'new').length;

  const reset = () => {
    if (window.confirm('Reset products and orders to the demo data? Your changes will be lost.')) resetDemoData();
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-white/[0.08] bg-charcoal lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6">
          <div>
            <Logo />
            <p className="mt-1 hidden text-xs text-white/40 lg:block">Admin</p>
          </div>
          <div className="flex items-center gap-1 lg:hidden">
            <Link href="/" aria-label="View store" className="grid h-9 w-9 place-items-center rounded-full text-white/70 hover:text-gold"><ExternalLink size={17} /></Link>
            <button type="button" onClick={onLogout} aria-label="Sign out" className="grid h-9 w-9 place-items-center rounded-full text-white/70 hover:text-gold"><LogOut size={17} /></button>
          </div>
        </div>

        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm transition',
                tab === id ? 'bg-gold/20 text-gold-light' : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={17} /> {label}
              {id === 'orders' && newOrders > 0 && (
                <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-ink">{newOrders}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-8 hidden space-y-1 px-3 lg:block">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"><ExternalLink size={17} /> View store</Link>
          <button type="button" onClick={reset} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"><RotateCcw size={17} /> Reset demo data</button>
          <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"><LogOut size={17} /> Sign out</button>
        </div>
      </aside>

      <main className="min-w-0 p-4 sm:p-8">
        {!ready ? (
          <p className="text-sm text-white/60">Loading data</p>
        ) : (
          <>
            {tab === 'overview' && <Overview goTo={setTab} />}
            {tab === 'products' && <ProductsManager />}
            {tab === 'orders' && <OrdersManager />}
            <button type="button" onClick={reset} className="mt-10 text-xs text-white/40 hover:text-gold lg:hidden">Reset demo data</button>
          </>
        )}
      </main>
    </div>
  );
}
