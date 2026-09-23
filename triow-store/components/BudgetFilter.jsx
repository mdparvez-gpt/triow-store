'use client';

import { useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { BUDGET } from '@/lib/config';
import { cn, clamp, formatBDT } from '@/lib/utils';

const BINS = 22;
const THUMB = 11; // half the thumb width in px, keeps histogram aligned with the handles

const PRESETS = [
  { label: 'Under 1,000', min: null, max: 1000 },
  { label: '1,000 to 2,000', min: 1000, max: 2000 },
  { label: '2,000 to 3,500', min: 2000, max: 3500 },
  { label: '3,500 and up', min: 3500, max: null },
];

/**
 * Smart Budget Filter: histogram of the catalogue's prices with a two-handle slider on top.
 * Controlled by useProductFilters(): value = [min, max].
 */
export default function BudgetFilter({ prices, bounds, value, onChange, onReset, active, matchCount, className }) {
  const [lo, hi] = value;
  const span = bounds.max - bounds.min;
  const pct = (v) => ((v - bounds.min) / span) * 100;

  // Local text state so people can type freely; committed on blur / Enter.
  const [minText, setMinText] = useState(String(lo));
  const [maxText, setMaxText] = useState(String(hi));
  useEffect(() => setMinText(String(lo)), [lo]);
  useEffect(() => setMaxText(String(hi)), [hi]);

  const bars = useMemo(() => {
    const counts = new Array(BINS).fill(0);
    prices.forEach((p) => {
      const i = clamp(Math.floor(((p - bounds.min) / span) * BINS), 0, BINS - 1);
      counts[i] += 1;
    });
    const top = Math.max(1, ...counts);
    return counts.map((n, i) => {
      const from = bounds.min + (span / BINS) * i;
      const to = from + span / BINS;
      return { n, h: n === 0 ? 4 : 10 + (n / top) * 90, inRange: to > lo && from < hi };
    });
  }, [prices, bounds.min, span, lo, hi]);

  const setLo = (v) => onChange([clamp(v, bounds.min, hi - BUDGET.step), hi]);
  const setHi = (v) => onChange([lo, clamp(v, lo + BUDGET.step, bounds.max)]);

  const commit = (which) => {
    if (which === 'min') {
      const n = Number(minText);
      Number.isFinite(n) && minText !== '' ? setLo(n) : setMinText(String(lo));
    } else {
      const n = Number(maxText);
      Number.isFinite(n) && maxText !== '' ? setHi(n) : setMaxText(String(hi));
    }
  };

  const onKeyCommit = (which) => (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit(which);
    }
  };

  return (
    <section
      aria-label="Smart budget filter"
      className={cn('glass rounded-luxe p-5 sm:p-7', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl">What’s your budget?</h3>
          <p className="mt-1 text-sm text-white/60" aria-live="polite">
            {matchCount === 0
              ? 'Nothing in this range. Try widening it.'
              : `${matchCount} ${matchCount === 1 ? 'piece matches' : 'pieces match'}`}
          </p>
        </div>
        <p className="rounded-full border border-gold/40 px-4 py-1.5 text-sm font-medium text-gold-light">
          {formatBDT(lo)} to {formatBDT(hi)}
        </p>
      </div>

      <div className="mt-7 flex h-20 items-end gap-[3px]" style={{ marginInline: THUMB }} aria-hidden="true">
        {bars.map((b, i) => (
          <div
            key={i}
            className={cn('flex-1 rounded-t-[3px] transition-colors duration-200', b.inRange ? 'bg-gold/80' : 'bg-white/10')}
            style={{ height: `${b.h}%` }}
          />
        ))}
      </div>

      <div className="dual-range mt-1">
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/20" style={{ left: THUMB, right: THUMB }} />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gold"
          style={{
            left: `calc(${THUMB}px + (100% - ${THUMB * 2}px) * ${pct(lo) / 100})`,
            right: `calc(${THUMB}px + (100% - ${THUMB * 2}px) * ${1 - pct(hi) / 100})`,
          }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          min={bounds.min}
          max={bounds.max}
          step={BUDGET.step}
          value={lo}
          onChange={(e) => setLo(Number(e.target.value))}
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={bounds.min}
          max={bounds.max}
          step={BUDGET.step}
          value={hi}
          onChange={(e) => setHi(Number(e.target.value))}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="budget-min" className="label">Minimum (BDT)</label>
          <input
            id="budget-min"
            inputMode="numeric"
            className="field"
            value={minText}
            onChange={(e) => setMinText(e.target.value.replace(/[^\d]/g, ''))}
            onBlur={() => commit('min')}
            onKeyDown={onKeyCommit('min')}
          />
        </div>
        <div>
          <label htmlFor="budget-max" className="label">Maximum (BDT)</label>
          <input
            id="budget-max"
            inputMode="numeric"
            className="field"
            value={maxText}
            onChange={(e) => setMaxText(e.target.value.replace(/[^\d]/g, ''))}
            onBlur={() => commit('max')}
            onKeyDown={onKeyCommit('max')}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange([p.min ?? bounds.min, p.max ?? bounds.max])}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs transition',
              lo === (p.min ?? bounds.min) && hi === (p.max ?? bounds.max)
                ? 'border-gold bg-gold text-ink'
                : 'border-white/20 text-white/75 hover:border-gold hover:text-gold'
            )}
          >
            {p.label}
          </button>
        ))}
        {active && (
          <button
            type="button"
            onClick={onReset}
            className="ml-auto inline-flex items-center gap-1.5 text-xs text-white/60 transition hover:text-gold"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>
    </section>
  );
}
