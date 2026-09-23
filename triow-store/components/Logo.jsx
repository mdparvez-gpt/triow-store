import Link from 'next/link';

export default function Logo({ className = '' }) {
  return (
    <Link href="/" aria-label="TrioW home" className={`font-serif text-[1.7rem] font-semibold leading-none tracking-wide text-white ${className}`}>
      Trio<span className="text-gold">W</span>
    </Link>
  );
}
