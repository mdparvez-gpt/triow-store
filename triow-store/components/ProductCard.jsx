'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { getProductImages } from '@/lib/garment';
import { SIZES, categoryLabel } from '@/lib/config';
import { sizeStock, stockStatus } from '@/lib/stock';
import { cn, discountPercent, formatBDT } from '@/lib/utils';
import Stars from '@/components/Stars';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const images = getProductImages(product);
  const status = stockStatus(product);
  const wished = wishlist.includes(product.id);
  const discount = discountPercent(product);
  const href = `/product/${product.slug}`;

  const badges = [];
  if (status === 'out') badges.push('Sold out');
  else {
    if (discount) badges.push(`Save ${discount}%`);
    if (product.newArrival) badges.push('New');
    else if (product.bestSeller) badges.push('Best seller');
  }

  return (
    <article className="group">
      <div className="relative">
      <Link
        href={href}
        className="relative block aspect-[5/6] overflow-hidden rounded-luxe border border-white/[0.07] bg-panel"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[1] || images[0]}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[0]}
          alt={product.title}
          loading="lazy"
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:opacity-0',
            status === 'out' && 'opacity-50'
          )}
        />
        {badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {badges.slice(0, 2).map((b) => (
              <span
                key={b}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-md',
                  b === 'Sold out' ? 'bg-black/70 text-white/80' : 'bg-gold/90 text-ink'
                )}
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={wished}
        aria-label={wished ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        className="glass absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full text-white transition hover:border-gold hover:text-gold"
      >
        <Heart size={17} className={wished ? 'fill-gold text-gold' : ''} />
      </button>

      {status !== 'out' && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition duration-300 md:block md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <div className="glass rounded-2xl p-2.5">
            <p className="mb-2 text-center text-xs text-white/70">Quick add</p>
            <div className="flex justify-center gap-1.5">
              {SIZES.map((s) => {
                const left = sizeStock(product, s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={left <= 0}
                    onClick={() => addToCart(product.id, s, 1)}
                    aria-label={`Add size ${s} to bag`}
                    className="h-8 min-w-8 rounded-lg border border-white/20 px-2 text-xs text-white transition hover:border-gold hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:text-white/25 disabled:line-through disabled:hover:border-white/20 disabled:hover:bg-transparent disabled:hover:text-white/25"
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      </div>

      <div className="mt-3 px-1">
        <p className="text-xs text-white/50">{categoryLabel(product.category)}</p>
        <h3 className="mt-0.5 font-sans text-[15px] font-medium leading-snug text-white">
          <Link href={href} className="transition hover:text-gold">
            {product.title}
          </Link>
        </h3>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold text-gold-light">{formatBDT(product.price)}</span>
            {product.compareAt > product.price && (
              <span className="text-xs text-white/40 line-through">{formatBDT(product.compareAt)}</span>
            )}
          </p>
          <span className="hidden items-center gap-1 text-xs text-white/60 sm:inline-flex">
            <Stars value={1} size={12} />
            {product.rating}
          </span>
        </div>
      </div>
    </article>
  );
}
