'use client';

import Link from 'next/link';
import { useStore } from '@/hooks/useStore';
import { CATEGORIES } from '@/lib/config';
import { garmentImage } from '@/lib/garment';
import SectionHeading from '@/components/SectionHeading';

export default function CategoryGrid() {
  const { products, ready } = useStore();

  return (
    <section className="container-x pt-20 sm:pt-28" aria-labelledby="cat-heading">
      <SectionHeading
        title={<span id="cat-heading">Shop by category</span>}
        description="Six ways into the collection, from everyday tees to custom-printed team wear."
        href="/shop"
        linkLabel="All products"
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="group relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-luxe border border-white/[0.07] bg-panel p-4 sm:p-6 lg:aspect-[16/11]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={garmentImage({ type: c.art, color: c.color, view: 'front', graphic: !!c.graphic })}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <h3 className="text-2xl sm:text-3xl">{c.label}</h3>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                {c.blurb}
                {ready ? `, ${count} ${count === 1 ? 'style' : 'styles'}` : ''}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
