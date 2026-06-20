"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Stars } from "@/components/ui/stars";
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
      toast.success("Added to bag");
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
    <div className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-blush">
        {product.primary_image ? (
          <Image
            src={product.primary_image.card}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink/30">
            No image
          </div>
        )}

        {discountPct > 0 && (
          <span className="absolute left-3 top-3 z-20 bg-accent px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">
            −{discountPct}%
          </span>
        )}

        {/* Wishlist — reveals on hover (always visible on touch) */}
        <button
          type="button"
          onClick={onToggleFav}
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={fav}
          className={`absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center bg-white/85 backdrop-blur transition duration-300 hover:bg-white lg:opacity-0 lg:group-hover:opacity-100 ${
            fav ? "opacity-100" : ""
          }`}
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

        {/* Quick action — slides up on hover (always shown on touch) */}
        {product.has_options ? (
          <Link
            href={href}
            className="absolute inset-x-0 bottom-0 z-20 flex h-11 items-center justify-center bg-ink text-xs font-semibold uppercase tracking-[0.1em] text-white transition-transform duration-300 ease-out-expo hover:bg-accent lg:translate-y-full lg:group-hover:translate-y-0"
          >
            Choose options
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            disabled={adding || !product.default_variant}
            className="absolute inset-x-0 bottom-0 z-20 flex h-11 items-center justify-center bg-ink text-xs font-semibold uppercase tracking-[0.1em] text-white transition-transform duration-300 ease-out-expo hover:bg-accent disabled:opacity-60 lg:translate-y-full lg:group-hover:translate-y-0"
          >
            {adding ? "Adding…" : "Add to bag"}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-3">
        {product.brand && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">
            {product.brand.name}
          </span>
        )}
        <h3 className="text-sm text-ink transition-colors group-hover:text-primary">
          {product.title}
        </h3>
        {product.price_from && (
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-ink">{price}</span>
            {compareAt && (
              <span className="text-xs text-ink/40 line-through">
                {compareAt}
              </span>
            )}
          </div>
        )}
        {product.rating_count > 0 && (
          <div className="mt-1 flex items-center gap-1.5">
            <Stars rating={Number(product.rating_avg)} size={12} />
            <span className="text-[11px] text-ink/45">
              ({product.rating_count})
            </span>
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
