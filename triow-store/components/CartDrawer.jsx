'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useLockBody } from '@/hooks/useLockBody';
import { useEscape } from '@/hooks/useEscape';
import { DELIVERY, FREE_DELIVERY_THRESHOLD } from '@/lib/config';
import { getProductImages } from '@/lib/garment';
import { cn, formatBDT } from '@/lib/utils';

export default function CartDrawer() {
  const {
    cartOpen, closeCart, cartLines, payableLines, subtotal, deliveryFee, total,
    zone, setZone, setLineQty, removeLine,
  } = useStore();

  useLockBody(cartOpen);
  useEscape(cartOpen, closeCart);

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-charcoal"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
              <h2 className="text-2xl">Your bag</h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:text-gold"
              >
                <X size={22} />
              </button>
            </div>

            {cartLines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="glass grid h-16 w-16 place-items-center rounded-full">
                  <ShoppingBag className="text-gold" />
                </div>
                <p className="font-serif text-2xl text-white">Your bag is empty</p>
                <p className="text-sm text-mist/70">Add a piece and it will show up here with delivery and total.</p>
                <Link href="/shop?sort=featured" onClick={closeCart} className="btn btn-gold mt-2">
                  Browse best sellers
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-white/[0.08] px-6 py-4">
                  <p className="text-xs text-white/70">
                    {remaining > 0
                      ? `Add ${formatBDT(remaining)} more for free delivery`
                      : 'Your order qualifies for free delivery'}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gold"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-white/[0.07] overflow-y-auto px-6">
                  {cartLines.map((line) => (
                    <li key={line.key} className="flex gap-4 py-5">
                      <Link href={`/product/${line.product.slug}`} onClick={closeCart} className="shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getProductImages(line.product)[0]}
                          alt=""
                          className={cn('h-24 w-20 rounded-xl object-cover', line.unavailable && 'opacity-40')}
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{line.product.title}</p>
                            <p className="mt-0.5 text-xs text-white/50">
                              Size {line.size}, {line.product.colorName}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLine(line.key)}
                            aria-label={`Remove ${line.product.title} size ${line.size}`}
                            className="text-white/40 transition hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {line.unavailable ? (
                          <p className="mt-2 text-xs text-red-300">
                            This size just sold out. Remove it or pick another size.
                          </p>
                        ) : (
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center rounded-full border border-white/20">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() => setLineQty(line.key, line.qty - 1)}
                                className="grid h-8 w-8 place-items-center text-white transition hover:text-gold"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center text-sm text-white" aria-live="polite">
                                {line.qty}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                disabled={line.qty >= line.max}
                                onClick={() => setLineQty(line.key, line.qty + 1)}
                                className="grid h-8 w-8 place-items-center text-white transition hover:text-gold disabled:opacity-30 disabled:hover:text-white"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-gold-light">
                              {formatBDT(line.product.price * line.qty)}
                            </p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/[0.08] bg-ink/40 px-6 py-5">
                  <fieldset>
                    <legend className="mb-2 text-xs text-white/60">Delivery area</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(DELIVERY).map(([key, d]) => (
                        <label
                          key={key}
                          className={cn(
                            'cursor-pointer rounded-xl border px-3 py-2.5 text-center text-xs transition',
                            zone === key
                              ? 'border-gold bg-gold/10 text-white'
                              : 'border-white/10 text-white/70 hover:border-white/30'
                          )}
                        >
                          <input
                            type="radio"
                            name="zone"
                            value={key}
                            checked={zone === key}
                            onChange={() => setZone(key)}
                            className="sr-only"
                          />
                          <span className="block font-medium">{d.label}</span>
                          <span className="text-white/50">{formatBDT(d.fee)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <dl className="mt-5 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-white/60">Subtotal</dt>
                      <dd className="text-white">{formatBDT(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-white/60">Delivery ({DELIVERY[zone].label})</dt>
                      <dd className="text-white">{deliveryFee === 0 ? 'Free' : formatBDT(deliveryFee)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-3 text-base">
                      <dt className="text-white">Total</dt>
                      <dd className="font-semibold text-gold-light">{formatBDT(total)}</dd>
                    </div>
                  </dl>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    aria-disabled={payableLines.length === 0}
                    className={cn('btn btn-gold mt-5 w-full', payableLines.length === 0 && 'pointer-events-none opacity-50')}
                  >
                    Checkout
                  </Link>
                  <button type="button" onClick={closeCart} className="mt-3 w-full text-center text-xs text-white/60 transition hover:text-gold">
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
