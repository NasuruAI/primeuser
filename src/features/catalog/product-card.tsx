"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useToast } from "@/components/ui/toast";
import { useCart } from "@/features/cart/cart-context";
import { useFavourites } from "@/features/favourites/favourites-context";
import { cartApi } from "@/lib/cart-client";
import type { ProductListItem } from "@/types/catalog";

export function ProductCard({ product }: { product: ProductListItem }) {
  const { run, openCart } = useCart();
  const { isFavourite, toggle } = useFavourites();
  const toast = useToast();
  const [adding, setAdding] = useState(false);

  const price =
    product.price_from_display?.formatted ?? `$${product.price_from}`;
  const compareAt = product.compare_at_from_display?.formatted ?? null;
  const discountPct = Number(product.discount_percent) || 0;
  const fav = isFavourite(product.id);
  const href = `/p/${product.slug}`;

  async function onAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.default_variant) return;
    setAdding(true);
    try {
      await run(() => cartApi.addItem(product.default_variant!, 1));
      toast.success("Added to cart");
      openCart();
    } catch {
      // Error already surfaced as a toast by the cart context.
    } finally {
      setAdding(false);
    }
  }

  function onToggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  }

  return (
    <div className="group relative flex flex-col border border-ink/10 bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative aspect-square overflow-hidden bg-blush">
        {product.primary_image ? (
          <Image
            src={product.primary_image.card}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink/30">
            No image
          </div>
        )}

        {discountPct > 0 && (
          <span className="absolute left-3 top-3 z-20 bg-accent px-2.5 py-0.5 text-[11px] font-bold text-white">
            −{discountPct}%
          </span>
        )}

        {product.brand && (
          <span
            className={`absolute left-3 z-20 bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-ink/70 backdrop-blur ${
              discountPct > 0 ? "top-11" : "top-3"
            }`}
          >
            {product.brand.name}
          </span>
        )}

        {/* Add to favourites — top right */}
        <button
          type="button"
          onClick={onToggleFav}
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={fav}
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center border border-ink/10 bg-white/90 backdrop-blur transition hover:border-accent"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={fav ? "#C9184A" : "none"}
            aria-hidden
            className={fav ? "text-accent" : "text-ink/60"}
          >
            <path
              d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5.5 5.5 5.5c1.9 0 3.2 1.1 3.9 2.2.6-1.1 2-2.2 3.9-2.2 3 0 4.5 3 3 6C19 15.65 12 20 12 20Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Add to cart (or choose options) — bottom right */}
        {product.has_options ? (
          <Link
            href={href}
            aria-label={`Choose options for ${product.title}`}
            className="absolute bottom-3 right-3 z-20 inline-flex h-10 items-center bg-ink px-3 text-xs font-medium text-white shadow-lg transition duration-200 hover:bg-accent"
          >
            Options
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            disabled={adding || !product.default_variant}
            aria-label={`Add ${product.title} to cart`}
            className="absolute bottom-3 right-3 z-20 inline-flex h-10 w-10 items-center justify-center bg-ink text-white shadow-lg transition duration-200 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {adding ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="animate-spin"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 7h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 7a3 3 0 0 1 6 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-sm font-medium text-ink transition group-hover:text-primary">
          {product.title}
        </h3>
        {product.price_from && (
          <div className="mt-auto flex items-baseline gap-1.5 pt-2">
            <span className="text-[11px] uppercase tracking-wide text-ink/45">
              from
            </span>
            <span className="text-base font-semibold text-ink">{price}</span>
            {compareAt && (
              <span className="text-sm text-ink/40 line-through">
                {compareAt}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stretched link navigates the whole card; the action buttons sit above it. */}
      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-label={product.title}
      />
    </div>
  );
}
