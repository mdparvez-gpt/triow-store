import Link from 'next/link';

export default function SectionHeading({ title, description, href, linkLabel }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
      <div className="max-w-xl">
        <h2 className="text-3xl leading-tight sm:text-4xl">{title}</h2>
        {description && <p className="mt-2 text-sm leading-relaxed text-mist/80 sm:text-base">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm text-gold underline-offset-4 transition hover:text-gold-light hover:underline">
          {linkLabel || 'View all'}
        </Link>
      )}
    </div>
  );
}
