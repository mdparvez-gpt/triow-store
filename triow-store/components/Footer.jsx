import Link from 'next/link';
import { BRAND, CATEGORIES, DELIVERY, FREE_DELIVERY_THRESHOLD } from '@/lib/config';
import { formatBDT } from '@/lib/utils';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.08] bg-charcoal">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist/70">
            Premium everyday wear, made to be worn on repeat. {BRAND.tagline}
          </p>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className="text-mist/70 transition hover:text-gold">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Delivery and returns</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-mist/70">
            {Object.values(DELIVERY).map((d) => (
              <li key={d.label}>
                {d.label}: {formatBDT(d.fee)}, {d.eta}
              </li>
            ))}
            <li>Free delivery over {formatBDT(FREE_DELIVERY_THRESHOLD)}</li>
            <li>Exchange within 7 days of delivery</li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-mist/70">
            <li>{BRAND.phone}</li>
            <li>{BRAND.email}</li>
            <li>We accept cash on delivery, bKash, Nagad and cards.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06] py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} TrioW. All rights reserved.
      </div>
    </footer>
  );
}
