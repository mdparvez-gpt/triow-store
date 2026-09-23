'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { garmentImage } from '@/lib/garment';
import { cn } from '@/lib/utils';

const SLIDES = [
  {
    title: 'Triow On. Style On.',
    body: 'Heavyweight tees, sharp polos and warm layers, cut for daily wear and built to last through repeat washes.',
    cta: { label: 'Shop the collection', href: '/shop' },
    second: { label: 'See new in', href: '/shop?sort=newest' },
    art: { type: 'hoodie', color: '#1f1f1f' },
  },
  {
    title: 'Polos that keep their shape.',
    body: 'Textured piqué, firm collars and a fit that works from the office to the evening.',
    cta: { label: 'Shop polos', href: '/shop?category=polos' },
    second: { label: 'Shop by budget', href: '/#budget' },
    art: { type: 'polo', color: '#1f2a44' },
  },
  {
    title: 'Wear your own design.',
    body: 'Custom tees and team polos, printed to order. Send your artwork and we confirm a proof before we print.',
    cta: { label: 'Explore custom wear', href: '/shop?category=custom-wear' },
    second: { label: 'View best sellers', href: '/shop?sort=featured' },
    art: { type: 'tshirt', color: '#1f1f1f', graphic: true },
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const go = useCallback((n) => setIndex((n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused || reduce) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [paused, reduce]);

  const slide = SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative overflow-hidden border-b border-white/[0.06]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-[0.14]"
        style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="container-x grid min-h-[34rem] items-center gap-8 py-10 sm:py-14 lg:min-h-[40rem] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              aria-live="polite"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <h1 className="max-w-xl text-[2.9rem] font-medium leading-[1.02] sm:text-6xl lg:text-[5.2rem]">{slide.title}</h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-mist sm:text-lg">{slide.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={slide.cta.href} className="btn btn-gold px-7 py-3.5">
                  {slide.cta.label}
                </Link>
                <Link href={slide.second.href} className="btn btn-ghost px-7 py-3.5">
                  {slide.second.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
              {SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => go(i)}
                  className={cn('h-1.5 rounded-full transition-all duration-300', i === index ? 'w-10 bg-gold' : 'w-4 bg-white/25 hover:bg-white/50')}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous slide"
                className="glass grid h-10 w-10 place-items-center rounded-full text-white transition hover:border-gold hover:text-gold"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next slide"
                className="glass grid h-10 w-10 place-items-center rounded-full text-white transition hover:border-gold hover:text-gold"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-[19rem] sm:max-w-sm lg:order-2 lg:max-w-md">
          <div className="glass relative aspect-[5/6] overflow-hidden rounded-[2rem] p-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="h-full w-full overflow-hidden rounded-[1.6rem]"
                initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={garmentImage({ ...slide.art, view: 'front' })}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
