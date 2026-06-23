"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { AddToCart } from "@/features/cart/add-to-cart";
import { OrderChatButton } from "@/features/order-chat/order-chat-button";
import type { MoneyDisplay, ProductDetail, Variant } from "@/types/catalog";

function optionsKey(ids: number[]): string {
  return [...new Set(ids)].sort((a, b) => a - b).join("-");
}

/** The MoneyDisplay (tier-aware) for buying ``qty`` of a variant. */
function displayForQty(v: Variant, qty: number): MoneyDisplay | null {
  let best = v.price_display;
  let bestMin = 0;
  for (const t of v.price_tiers ?? []) {
    if (qty >= t.min_qty && t.min_qty > bestMin && t.unit_price_display) {
      best = t.unit_price_display;
      bestMin = t.min_qty;
    }
  }
  return best;
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
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
  const [qty, setQty] = useState(1);

  const selectedVariant: Variant | null = useMemo(() => {
    if (optionTypes.length === 0) {
      return variants.find((v) => v.is_default) ?? variants[0] ?? null;
    }
    if (Object.keys(selection).length !== optionTypes.length) return null;
    return byKey.get(optionsKey(Object.values(selection))) ?? null;
  }, [optionTypes, selection, byKey, variants]);

  // Reset quantity to the selected variant's MOQ whenever the variant changes.
  const moq = selectedVariant?.moq ?? 1;
  useEffect(() => {
    setQty(moq);
  }, [selectedVariant?.id, moq]);

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

      <div className="border border-ink/10 bg-white p-5">
        {selectedVariant ? (
          (() => {
            const disp = displayForQty(selectedVariant, qty);
            const unit = disp?.formatted ?? `$${selectedVariant.price}`;
            const estTotal =
              disp && disp.amount
                ? formatMoney(Number(disp.amount) * qty, disp.currency)
                : null;
            const tiers = selectedVariant.price_tiers ?? [];
            const isWholesale = moq > 1 || tiers.length > 0;
            return (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-display text-3xl font-bold text-ink">
                    {unit}
                  </span>
                  {isWholesale && (
                    <span className="text-sm text-ink/45">/ unit</span>
                  )}
                  {selectedVariant.compare_at_display && (
                    <span className="text-lg text-red-500 line-through">
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
                      "px-2.5 py-0.5 text-xs font-medium",
                      selectedVariant.in_stock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600",
                    )}
                  >
                    {selectedVariant.in_stock ? "In stock" : "Out of stock"}
                  </span>
                </div>

                {/* Price breaks (wholesale) */}
                {tiers.length > 0 && (
                  <div className="border border-ink/10">
                    <div className="bg-blush px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/55">
                      Buy more, save more
                    </div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-ink/10">
                        <tr>
                          <td className="px-3 py-1.5 text-ink/60">
                            {moq}+ units
                          </td>
                          <td className="px-3 py-1.5 text-right font-medium text-ink">
                            {selectedVariant.price_display?.formatted} / unit
                          </td>
                        </tr>
                        {tiers.map((t) => (
                          <tr key={t.min_qty}>
                            <td className="px-3 py-1.5 text-ink/60">
                              {t.min_qty}+ units
                            </td>
                            <td className="px-3 py-1.5 text-right font-medium text-ink">
                              {t.unit_price_display?.formatted ?? t.unit_price} /
                              unit
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-ink/15">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((q) => Math.max(moq, q - 1))}
                      className="flex h-10 w-10 items-center justify-center text-ink transition hover:bg-ink/5"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={moq}
                      value={qty}
                      onChange={(e) =>
                        setQty(Math.max(moq, Number(e.target.value) || moq))
                      }
                      className="h-10 w-16 border-x border-ink/15 text-center text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty((q) => q + 1)}
                      className="flex h-10 w-10 items-center justify-center text-ink transition hover:bg-ink/5"
                    >
                      +
                    </button>
                  </div>
                  {isWholesale && (
                    <span className="text-xs text-ink/50">
                      Min. order {moq}
                      {estTotal && (
                        <>
                          {" · "}
                          <span className="font-medium text-ink">
                            {estTotal}
                          </span>{" "}
                          total
                        </>
                      )}
                    </span>
                  )}
                </div>

                <span className="text-xs text-ink/45">
                  SKU {selectedVariant.sku}
                </span>
                <AddToCart
                  variantId={selectedVariant.id}
                  quantity={qty}
                  disabled={!selectedVariant.in_stock}
                />
                <OrderChatButton
                  context="product"
                  variantId={selectedVariant.id}
                  quantity={qty}
                  className="mt-1"
                />
              </div>
            );
          })()
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
