import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { ProductCard } from "@/features/catalog/product-card";
import { Hero } from "@/features/home/hero";
import { Newsletter } from "@/features/home/newsletter";
import { getCategories, getProducts } from "@/lib/catalog";
import { getStoreConfig } from "@/lib/config";
import { selectedCurrency } from "@/lib/currency";

const MARQUEE = [
  "Free shipping over ₦50,000",
  "Shop in any currency",
  "Secure checkout",
  "Easy 30-day returns",
  "Pay for a friend",
];

export default async function Home() {
  const currency = selectedCurrency();
  const [products, categories, { name: storeName }] = await Promise.all([
    getProducts({ currency }).catch(() => ({ results: [] })),
    getCategories().catch(() => []),
    getStoreConfig(),
  ]);
  const featured = products.results.slice(0, 8);

  return (
    <div>
      <Hero />

      {/* Marquee value strip */}
      <div className="overflow-hidden border-y border-ink/10 bg-canvas py-3">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-12 text-xs font-medium uppercase tracking-[0.14em] text-ink/55"
            >
              {item}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-site pt-16 sm:pt-20">
          <Reveal className="mb-8 flex items-end justify-between">
            <div>
              <span className="eyebrow">Browse</span>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
                Shop by category
              </h2>
            </div>
            <Link
              href="/catalog"
              className="link-underline hidden text-sm font-medium uppercase tracking-[0.08em] text-ink/70 hover:text-ink sm:block"
            >
              View all
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((c, i) => (
              <Reveal key={c.id} delay={i * 60}>
                <Link
                  href={`/catalog?category=${c.slug}`}
                  className="group flex aspect-[4/3] flex-col justify-between overflow-hidden border border-ink/10 bg-white p-5 transition-colors duration-300 hover:bg-ink"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink/40 transition-colors group-hover:text-canvas/50">
                    0{i + 1}
                  </span>
                  <span className="flex items-end justify-between">
                    <span className="font-display text-xl font-bold text-ink transition-colors group-hover:text-canvas">
                      {c.name}
                    </span>
                    <span className="text-ink/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-canvas">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="container-site py-16 sm:py-20">
        <Reveal className="mb-9 flex items-end justify-between">
          <div>
            <span className="eyebrow">Curated</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
              Featured this week
            </h2>
          </div>
          <Link
            href="/catalog"
            className="link-underline text-sm font-medium uppercase tracking-[0.08em] text-ink/70 hover:text-ink"
          >
            View all
          </Link>
        </Reveal>

        {featured.length === 0 ? (
          <p className="border border-dashed border-ink/15 bg-white p-10 text-center text-ink/50">
            No products yet. Add products in the admin to see them here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Editorial brand band */}
      <section className="container-site pb-16 sm:pb-20">
        <Reveal>
          <div className="relative overflow-hidden bg-primary px-6 py-16 text-blush sm:px-12 sm:py-20">
            <div
              className="absolute -right-16 -top-16 h-72 w-72 bg-accent/30 blur-3xl"
              aria-hidden
            />
            <div className="relative max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-blush/70">
                The {storeName} promise
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
                Considered pieces. Honest prices. Delivered your way.
              </h2>
              <Link
                href="/catalog"
                className="group mt-8 inline-flex items-center gap-2 bg-blush px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-ink transition hover:bg-white"
              >
                Explore the collection
                <span className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Newsletter */}
      <section className="container-site pb-20">
        <Reveal>
          <Newsletter storeName={storeName} />
        </Reveal>
      </section>
    </div>
  );
}
