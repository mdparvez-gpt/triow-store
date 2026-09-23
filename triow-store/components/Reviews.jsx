import { SEED_REVIEWS } from '@/lib/seed';
import Stars from '@/components/Stars';
import SectionHeading from '@/components/SectionHeading';

export default function Reviews() {
  return (
    <section className="container-x pt-20 sm:pt-28" aria-labelledby="reviews-heading">
      <SectionHeading
        title={<span id="reviews-heading">What customers say</span>}
        description="Notes from people who have bought and worn TrioW."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SEED_REVIEWS.map((r) => (
          <figure key={r.name} className="card flex flex-col p-6">
            <Stars value={r.rating} />
            <blockquote className="mt-4 flex-1 font-serif text-xl leading-snug text-white/90">{r.text}</blockquote>
            <figcaption className="mt-5 text-xs text-white/50">
              <span className="text-sm text-white">{r.name}</span>, {r.city}. Bought the {r.product}.
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
