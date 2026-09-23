'use client';

import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const LABELS = ['Front', 'Back', 'Fabric detail', 'Flat lay'];

/** Thumbnail rail + main image. Hover (mouse) or tap (touch) to zoom, move to pan. */
export default function ImageGallery({ images, title }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  const setFromEvent = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`);
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse">
      <div
        className={cn(
          'relative aspect-[5/6] w-full flex-1 overflow-hidden rounded-luxe border border-white/[0.07] bg-panel',
          zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
        )}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setZoom(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setZoom(false)}
        onPointerMove={(e) => (zoom || e.pointerType === 'mouse') && setFromEvent(e)}
        onPointerUp={(e) => {
          if (e.pointerType !== 'mouse') {
            setFromEvent(e);
            setZoom((z) => !z);
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={`${title}, ${LABELS[active] || `view ${active + 1}`}`}
          draggable={false}
          className="h-full w-full select-none object-cover transition-transform duration-200 ease-out"
          style={{ transform: zoom ? 'scale(2)' : 'scale(1)', transformOrigin: origin }}
        />
        <span className="glass pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-white/80">
          <ZoomIn size={13} /> {zoom ? 'Zoomed' : 'Hover or tap to zoom'}
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto lg:flex-col" role="tablist" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={LABELS[i] || `View ${i + 1}`}
              onClick={() => {
                setActive(i);
                setZoom(false);
              }}
              className={cn(
                'h-24 w-20 shrink-0 overflow-hidden rounded-xl border transition',
                i === active ? 'border-gold' : 'border-white/10 opacity-70 hover:opacity-100'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
