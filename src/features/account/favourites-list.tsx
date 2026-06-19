"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useToast } from "@/components/ui/toast";
import { useCart } from "@/features/cart/cart-context";
import {
  useFavourites,
  type FavouriteItem,
} from "@/features/favourites/favourites-context";
import { cartApi } from "@/lib/cart-client";

export function FavouritesList() {
  const { items, remove } = useFavourites();

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-ink/15 bg-white p-16 text-center">
        <p className="text-ink/60">You haven&apos;t saved any favourites yet.</p>
        <Link
          href="/catalog"
          className="mt-5 inline-flex h-11 items-center bg-ink px-7 text-xs font-semibold uppercase tracking-[0.08em] text-canvas transition hover:bg-primary"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <FavouriteCard key={item.id} item={item} onRemove={() => remove(item.id)} />
      ))}
    </div>
  );
}

function FavouriteCard({
  item,
  onRemove,
}: {
  item: FavouriteItem;
  onRemove: () => void;
}) {
  const { run, openCart } = useCart();
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const href = `/p/${item.slug}`;

  async function onAdd() {
    if (!item.defaultVariant) return;
    setAdding(true);
    try {
      await run(() => cartApi.addItem(item.defaultVariant!, 1));
      toast.success("Added to cart");
      openCart();
    } catch {
      /* already toasted by cart context */
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="flex gap-4 border border-ink/10 bg-white p-4">
      <Link
        href={href}
        className="relative h-24 w-24 shrink-0 overflow-hidden border border-ink/10 bg-blush"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-[10px] text-ink/30">
            No image
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={href}
          className="truncate font-medium text-ink transition hover:text-primary"
        >
          {item.title}
        </Link>
        {item.price && (
          <div className="text-sm text-ink/70">{item.price}</div>
        )}

        <div className="mt-auto flex items-center gap-3 pt-3">
          {item.hasOptions || !item.defaultVariant ? (
            <Link
              href={href}
              className="inline-flex h-9 items-center bg-ink px-3 text-xs font-medium text-white transition hover:bg-accent"
            >
              Choose options
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              disabled={adding}
              className="inline-flex h-9 items-center bg-ink px-3 text-xs font-medium text-white transition hover:bg-accent disabled:opacity-50"
            >
              {adding ? "Adding…" : "Add to cart"}
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-medium text-ink/45 transition hover:text-accent"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
