import Link from "next/link";

import { ProductCard } from "@/features/catalog/product-card";
import type { ProductListItem } from "@/types/catalog";

function Bolt({ className = "" }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

/** Yellow flash-sale banner. Used as a section header on the home + /flash-sale pages. */
export function FlashSaleBar({
  count,
  href,
}: {
  count?: number;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-yellow-400 to-yellow-300 px-5 py-4 sm:px-7">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-yellow-400">
          <Bolt />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold leading-none text-ink sm:text-2xl">
            Flash Sale
          </h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-ink/60">
            Limited time{typeof count === "number" ? ` · ${count} deals` : ""}
          </p>
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-yellow-400 transition hover:bg-ink/85"
        >
          See all
        </Link>
      )}
    </div>
  );
}

export function FlashSaleSection({
  products,
  href = "/flash-sale",
}: {
  products: ProductListItem[];
  href?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="container-site py-16 sm:py-20">
      <div className="overflow-hidden border-2 border-yellow-400">
        <FlashSaleBar count={products.length} href={href} />
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 p-5 sm:p-7 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
