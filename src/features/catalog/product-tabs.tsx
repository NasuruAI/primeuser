"use client";

import { useState } from "react";

import { Markdown } from "@/components/blog/markdown";
import type { ProductDetail, Review } from "@/types/catalog";

import { ProductReviews } from "./product-reviews";

type TabKey = "description" | "features" | "reviews";

export function ProductTabs({
  product,
  reviews,
}: {
  product: ProductDetail;
  reviews: Review[];
}) {
  const [active, setActive] = useState<TabKey>("description");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "features", label: "Features" },
    { key: "reviews", label: `Reviews (${product.rating_count})` },
  ];

  return (
    <section className="mt-16 border-t border-ink/10 pt-10">
      <div className="mb-8 flex flex-wrap gap-6 border-b border-ink/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold uppercase tracking-[0.08em] transition ${
              active === t.key
                ? "border-ink text-ink"
                : "border-transparent text-ink/45 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "description" && (
        <div className="max-w-3xl">
          {product.description ? (
            <p className="whitespace-pre-line leading-relaxed text-ink/75">
              {product.description}
            </p>
          ) : (
            <p className="text-ink/45">No description provided.</p>
          )}
        </div>
      )}

      {active === "features" && (
        <div className="prose max-w-3xl prose-headings:font-display prose-headings:text-ink prose-p:text-ink/75 prose-li:text-ink/75 prose-strong:text-ink">
          {product.features?.trim() ? (
            <Markdown>{product.features}</Markdown>
          ) : (
            <p className="text-ink/45">No features listed.</p>
          )}
        </div>
      )}

      {active === "reviews" && (
        <ProductReviews
          productId={product.id}
          slug={product.slug}
          ratingAvg={Number(product.rating_avg)}
          ratingCount={product.rating_count}
          initialReviews={reviews}
        />
      )}
    </section>
  );
}
