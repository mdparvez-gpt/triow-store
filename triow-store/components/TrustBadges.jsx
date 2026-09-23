import { RefreshCw, ShieldCheck, Truck, Wallet } from 'lucide-react';
import { DELIVERY, FREE_DELIVERY_THRESHOLD } from '@/lib/config';
import { formatBDT } from '@/lib/utils';

const BADGES = [
  { icon: Truck, title: 'Delivery across Bangladesh', text: `From ${formatBDT(DELIVERY['inside-dhaka'].fee)} in Dhaka. Free over ${formatBDT(FREE_DELIVERY_THRESHOLD)}.` },
  { icon: Wallet, title: 'Cash on delivery', text: 'Check your order at the door, then pay. Or use bKash and Nagad.' },
  { icon: RefreshCw, title: '7-day exchange', text: 'Wrong size? Swap it within 7 days of delivery.' },
  { icon: ShieldCheck, title: 'Quality checked', text: 'Every piece is inspected for stitching and fabric before it ships.' },
];

export default function TrustBadges() {
  return (
    <section className="container-x pt-20 sm:pt-28" aria-label="Why shop with TrioW">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BADGES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="glass rounded-luxe p-6">
            <Icon className="text-gold" size={26} strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-4 font-sans text-[15px] font-semibold text-white">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-mist/70">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
