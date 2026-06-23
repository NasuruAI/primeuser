import Link from "next/link";

import { ProductCard } from "@/features/catalog/product-card";
import { SortSelect } from "@/features/catalog/sort-select";
import { getCategories, getProducts } from "@/lib/catalog";
import { selectedCurrency } from "@/lib/currency";

export const metadata = {
  title: "Shop Clothing in Lagos, Nigeria",
  description:
    "Browse the latest clothing and fashion — quality pieces with fast delivery across Lagos, Nigeria and nationwide.",
  alternates: { canonical: "/catalog" },
};

const SORT_MAP: Record<string, string> = {
  newest: "-created_at",
  "price-asc": "price_from",
  "price-desc": "-price_from",
  name: "title",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string };
}) {
  const currency = selectedCurrency();
  const ordering = SORT_MAP[searchParams.sort ?? "newest"] ?? "-created_at";
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      category: searchParams.category,
      search: searchParams.search,
      ordering,
      currency,
    }),
  ]);
  const activeCategory = categories.find(
    (c) => c.slug === searchParams.category,
  );

  const catHref = (slug?: string) => {
    const p = new URLSearchParams();
    if (slug) p.set("category", slug);
    if (searchParams.search) p.set("search", searchParams.search);
    if (searchParams.sort) p.set("sort", searchParams.sort);
    const qs = p.toString();
    return qs ? `/catalog?${qs}` : "/catalog";
  };

  const heading = searchParams.search
    ? `“${searchParams.search}”`
    : (activeCategory?.name ?? null);

  return (
    <div className="container-site py-10 sm:py-14">
      <header className="mb-8">
        <nav className="mb-3 text-xs uppercase tracking-[0.12em] text-ink/40">
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span className="px-2">/</span>
          <span className="text-ink/70">{activeCategory?.name ?? "Shop"}</span>
        </nav>
        {heading && (
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
            {heading}
          </h1>
        )}
        {searchParams.search && (
          <Link
            href="/catalog"
            className="mt-2 inline-block text-sm text-primary hover:text-accent"
          >
            Clear search
          </Link>
        )}
      </header>

      {/* Toolbar: categories + sort */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
        <nav className="flex flex-wrap gap-1.5 text-sm">
          <Link
            href={catHref()}
            className={`px-4 py-1.5 text-[13px] font-medium uppercase tracking-[0.06em] transition ${
              !searchParams.category
                ? "bg-ink text-canvas"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={catHref(c.slug)}
              className={`px-4 py-1.5 text-[13px] font-medium uppercase tracking-[0.06em] transition ${
                searchParams.category === c.slug
                  ? "bg-ink text-canvas"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </nav>
        {products.results.length > 0 && <SortSelect />}
      </div>

      {products.results.length === 0 ? (
        <div className="border border-dashed border-ink/15 bg-white p-16 text-center">
          <p className="text-ink/60">No products found.</p>
          <Link
            href="/catalog"
            className="mt-3 inline-block text-sm font-medium text-primary hover:text-accent"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
