'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { CATEGORIES, FREE_DELIVERY_THRESHOLD } from '@/lib/config';
import { formatBDT } from '@/lib/utils';
import { useStore } from '@/hooks/useStore';
import { useLockBody } from '@/hooks/useLockBody';
import { useEscape } from '@/hooks/useEscape';
import Logo from '@/components/Logo';
import SearchOverlay from '@/components/SearchOverlay';

const NAV = [
  { href: '/shop?sort=newest', label: 'New in' },
  ...CATEGORIES.map((c) => ({ href: `/shop?category=${c.slug}`, label: c.label })),
];

export default function Header() {
  const { cartCount, wishlist, openCart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useLockBody(menuOpen);
  useEscape(menuOpen, () => setMenuOpen(false));

  return (
    <>
      <div className="bg-gold px-4 py-2 text-center text-xs font-medium text-ink">
        Free delivery over {formatBDT(FREE_DELIVERY_THRESHOLD)}. Cash on delivery available nationwide.
      </div>

      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-ink/80 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <div className="flex items-center gap-3 lg:gap-8">
            <button
              type="button"
              className="-ml-2 grid h-10 w-10 place-items-center rounded-full text-white transition hover:text-gold lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <Logo />
          </div>

          <nav aria-label="Main" className="hidden items-center gap-5 text-[13px] lg:flex xl:gap-7">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-white/80 transition hover:text-gold">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="-mr-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:text-gold"
            >
              <Search size={20} />
            </button>
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlist.length} items`}
              className="relative grid h-10 w-10 place-items-center rounded-full text-white transition hover:text-gold"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-ink">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open bag, ${cartCount} items`}
              className="relative grid h-10 w-10 place-items-center rounded-full text-white transition hover:text-gold"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-ink">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-charcoal p-6"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:text-gold"
                >
                  <X size={22} />
                </button>
              </div>
              <nav aria-label="Mobile" className="mt-10 flex flex-col">
                {[{ href: '/shop', label: 'All products' }, ...NAV, { href: '/#budget', label: 'Shop by budget' }].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-white/[0.07] py-4 font-serif text-2xl text-white transition hover:text-gold"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
