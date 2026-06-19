import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="font-display text-7xl font-bold text-primary">404</span>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink">We couldn&apos;t find that page</h1>
      <p className="mt-2 max-w-md text-ink/55">
        The page you&apos;re looking for may have moved or no longer exists.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center bg-ink px-7 text-xs font-semibold uppercase tracking-[0.08em] text-canvas transition hover:bg-primary"
        >
          Back home
        </Link>
        <Link
          href="/catalog"
          className="inline-flex h-11 items-center border border-ink/15 bg-white px-7 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition hover:border-ink"
        >
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
