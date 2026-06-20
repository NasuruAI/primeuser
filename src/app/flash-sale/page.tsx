import type { Metadata } from "next";

import { ProductCard } from "@/features/catalog/product-card";
import { FlashSaleBar } from "@/features/home/flash-sale";
import { getProducts } from "@/lib/catalog";
import { selectedCurrency } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Flash Sale",
  description: "Limited-time flash deals — grab them before they're gone.",
  alternates: { canonical: "/flash-sale" },
};

export default async function FlashSalePage() {
  const currency = selectedCurrency();
  const { results } = await getProducts({ currency, flash: true }).catch(() => ({
    results: [],
  }));

  return (
    <div className="container-site py-8 sm:py-12">
      <div className="overflow-hidden border-2 border-yellow-400">
        <FlashSaleBar count={results.length} />
      </div>

      {results.length === 0 ? (
        <p className="mt-10 border border-dashed border-ink/15 bg-white p-10 text-center text-ink/50">
          No flash deals right now — check back soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
