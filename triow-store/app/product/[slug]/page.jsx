'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Minus, Plus, Truck } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { getProductImages } from '@/lib/garment';
import { DELIVERY, FREE_DELIVERY_THRESHOLD, categoryLabel } from '@/lib/config';
import { sizeStock, stockStatus } from '@/lib/stock';
import { discountPercent, formatBDT } from '@/lib/utils';
import ImageGallery from '@/components/ImageGallery';
import SizeSelector from '@/components/SizeSelector';
import StockBadge from '@/components/StockBadge';
import Stars from '@/components/Stars';
import Accordion from '@/components/Accordion';
import ProductGrid from '@/components/ProductGrid';

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { ready, products, addToCart, wishlist, toggleWishlist } = useStore();
  const product = products.find((p) => p.slug === slug);

  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [warn, setWarn] = useState(false);

  useEffect(() => {
    setSize(null);
    setQty(1);
    setWarn(false);
  }, [slug]);

  useEffect(() => {
    if (product) document.title = `${product.title} | TrioW`;
  }, [product]);

  // If the admin sells out the chosen size while it's open, deselect it.
  useEffect(() => {
    if (product && size && sizeStock(product, size) <= 0) setSize(null);
  }, [product, size]);

  const related = useMemo(() => {
    if (!product) return [];
    const same = products.filter((p) => p.category === product.category && p.id !== product.id);
    const rest = products.filter((p) => p.category !== product.category && p.id !== product.id && (p.bestSeller || p.featured));
    return [...same, ...rest].slice(0, 4);
  }, [products, product]);

  if (!ready) {
    return (
      <div className="container-x grid gap-10 py-12 lg:grid-cols-2">
        <div className="skeleton aspect-[5/6]" />
        <div className="space-y-4">
          <div className="skeleton h-10 w-2/3 !rounded-md" />
          <div className="skeleton h-6 w-1/4 !rounded-md" />
          <div className="skeleton h-40 !rounded-md" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-x grid min-h-[50vh] place-items-center py-20 text-center">
        <div>
          <h1 className="text-4xl">We couldn’t find that product</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-mist/70">It may have been removed or renamed.</p>
          <Link href="/shop" className="btn btn-gold mt-6">Back to the shop</Link>
        </div>
      </div>
    );
  }

  const images = getProductImages(product);
  const status = stockStatus(product);
  const discount = discountPercent(product);
  const wished = wishlist.includes(product.id);
  const max = size ? sizeStock(product, size) : 99;

  const handleAdd = (goCheckout = false) => {
    if (!size) {
      setWarn(true);
      return;
    }
    if (addToCart(product.id, size, qty) && goCheckout) router.push('/checkout');
  };

  return (
    <div className="container-x py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-white/50">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-gold">{categoryLabel(product.category)}</Link>
        <span className="mx-2">/</span>
        <span className="text-white/80">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <ImageGallery key={product.id + images.length} images={images} title={product.title} />

        <div className="lg:pt-2">
          <h1 className="text-4xl leading-tight sm:text-5xl">{product.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Stars value={product.rating} />
            <span className="text-white/60">{product.rating} from {product.reviews} reviews</span>
          </div>

          <p className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-gold-light">{formatBDT(product.price)}</span>
            {product.compareAt > product.price && (
              <>
                <span className="text-base text-white/40 line-through">{formatBDT(product.compareAt)}</span>
                <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-medium text-gold-light">Save {discount}%</span>
              </>
            )}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <StockBadge product={product} showCount />
            <span className="text-sm text-white/60">Colour: {product.colorName}</span>
          </div>

          <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-mist">{product.description}</p>

          <div className="mt-8">
            <SizeSelector
              product={product}
              value={size}
              onChange={(s) => {
                setSize(s);
                setWarn(false);
                setQty((q) => Math.min(q, Math.max(1, sizeStock(product, s))));
              }}
            />
            {warn && <p role="alert" className="mt-3 text-sm text-red-300">Choose a size to add this to your bag.</p>}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-white/20">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-12 w-11 place-items-center text-white transition hover:text-gold"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center text-sm text-white" aria-live="polite">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={qty >= max}
                onClick={() => setQty((q) => Math.min(max, q + 1))}
                className="grid h-12 w-11 place-items-center text-white transition hover:text-gold disabled:opacity-30 disabled:hover:text-white"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              type="button"
              disabled={status === 'out'}
              onClick={() => handleAdd(false)}
              className="btn btn-gold h-12 flex-1"
            >
              {status === 'out' ? 'Sold out' : 'Add to bag'}
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 text-white transition hover:border-gold hover:text-gold"
            >
              <Heart size={18} className={wished ? 'fill-gold text-gold' : ''} />
            </button>
          </div>
          <button
            type="button"
            disabled={status === 'out'}
            onClick={() => handleAdd(true)}
            className="btn btn-ghost mt-3 h-12 w-full"
          >
            Buy now
          </button>

          <div className="glass mt-6 flex gap-3 rounded-2xl p-4 text-sm">
            <Truck className="mt-0.5 shrink-0 text-gold" size={18} />
            <p className="leading-relaxed text-mist/80">
              Delivery is {formatBDT(DELIVERY['inside-dhaka'].fee)} inside Dhaka ({DELIVERY['inside-dhaka'].eta}) and{' '}
              {formatBDT(DELIVERY['outside-dhaka'].fee)} outside ({DELIVERY['outside-dhaka'].eta}). Free over{' '}
              {formatBDT(FREE_DELIVERY_THRESHOLD)}. Cash on delivery available.
            </p>
          </div>

          <div className="mt-8">
            <Accordion
              items={[
                { title: 'Product details', content: <p>{product.description}</p> },
                { title: 'Fabric', content: <p>{product.fabric}</p> },
                { title: 'Care instructions', content: <p>{product.care}</p> },
              ]}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-8 text-3xl sm:text-4xl">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
