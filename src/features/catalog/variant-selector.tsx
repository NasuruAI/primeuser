"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { AddToCart } from "@/features/cart/add-to-cart";
import type { ProductDetail, Variant } from "@/types/catalog";

function optionsKey(ids: number[]): string {
  return [...new Set(ids)].sort((a, b) => a - b).join("-");
}

/**
 * Interactive variant picker. Resolves the chosen combination to a variant
 * entirely client-side from the product's variant matrix (mirrors the backend
 * `options_key`), and greys out option values whose combinations don't exist or
 * are out of stock given the current selection.
 */
export function VariantSelector({ product }: { product: ProductDetail }) {
  const { option_types: optionTypes, variants } = product;

  const byKey = useMemo(() => {
    const map = new Map<string, Variant>();
    for (const v of variants) map.set(v.options_key, v);
    return map;
  }, [variants]);

  // Default selection: a simple product has a single default variant.
  const [selection, setSelection] = useState<Record<number, number>>({});

  const selectedVariant: Variant | null = useMemo(() => {
    if (optionTypes.length === 0) {
      return variants.find((v) => v.is_default) ?? variants[0] ?? null;
    }
    if (Object.keys(selection).length !== optionTypes.length) return null;
    return byKey.get(optionsKey(Object.values(selection))) ?? null;
  }, [optionTypes, selection, byKey, variants]);

  function isValueAvailable(typeId: number, valueId: number): boolean {
    // A value is available if some in-stock variant includes it and is
    // consistent with the current selection on the *other* option types.
    return variants.some((v) => {
      if (!v.in_stock) return false;
      if (!v.option_value_ids.includes(valueId)) return false;
      for (const [tId, vId] of Object.entries(selection)) {
        if (Number(tId) === typeId) continue;
        if (!v.option_value_ids.includes(vId)) return false;
      }
      return true;
    });
  }

  function pick(typeId: number, valueId: number) {
    setSelection((prev) => ({ ...prev, [typeId]: valueId }));
  }

  return (
    <div className="flex flex-col gap-5">
      {optionTypes.map((ot) => (
        <div key={ot.id}>
          <div className="mb-2.5 text-sm font-semibold text-ink">{ot.name}</div>
          <div className="flex flex-wrap gap-2">
            {ot.values.map((val) => {
              const available = isValueAvailable(ot.id, val.id);
              const selected = selection[ot.id] === val.id;
              return (
                <button
                  key={val.id}
                  type="button"
                  disabled={!available}
                  onClick={() => pick(ot.id, val.id)}
                  className={cn(
                    "min-w-11 rounded-full border px-4 py-2 text-sm font-medium transition",
                    selected
                      ? "border-primary bg-primary text-blush"
                      : "border-ink/20 bg-white text-ink hover:border-primary",
                    !available &&
                      "cursor-not-allowed border-dashed text-ink/30 line-through hover:border-ink/20",
                  )}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        {selectedVariant ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-ink">
                {selectedVariant.price_display?.formatted ??
                  `$${selectedVariant.price}`}
              </span>
              {selectedVariant.compare_at_display && (
                <span className="text-lg text-ink/40 line-through">
                  {selectedVariant.compare_at_display.formatted}
                </span>
              )}
              {Number(selectedVariant.discount_percent) > 0 && (
                <span className="bg-accent px-2 py-0.5 text-xs font-bold text-white">
                  −{Number(selectedVariant.discount_percent)}%
                </span>
              )}
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  selectedVariant.in_stock
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600",
                )}
              >
                {selectedVariant.in_stock ? `In stock` : "Out of stock"}
              </span>
            </div>
            {selectedVariant.price_display?.converted && (
              <span className="text-xs text-ink/50">
                ≈ {selectedVariant.price_display.base_currency}{" "}
                {selectedVariant.price_display.base_amount} · rate{" "}
                {Number(selectedVariant.price_display.rate).toFixed(4)}
              </span>
            )}
            <span className="text-xs text-ink/45">
              SKU {selectedVariant.sku}
            </span>
            <AddToCart
              variantId={selectedVariant.id}
              disabled={!selectedVariant.in_stock}
            />
          </div>
        ) : (
          <span className="text-sm text-ink/55">
            Select {optionTypes.map((o) => o.name).join(" and ")} to see the
            price.
          </span>
        )}
      </div>
    </div>
  );
}
