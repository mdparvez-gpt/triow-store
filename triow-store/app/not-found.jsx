import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <h1 className="text-5xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-mist/70">
          That link doesn’t lead anywhere. Head back to the shop to keep browsing.
        </p>
        <Link href="/shop" className="btn btn-gold mt-6">Go to the shop</Link>
      </div>
    </div>
  );
}
