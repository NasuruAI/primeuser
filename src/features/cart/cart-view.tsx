"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { cartApi } from "@/lib/cart-client";
import { OrderChatButton } from "@/features/order-chat/order-chat-button";
import type { Cart } from "@/types/cart";

import { useCart } from "./cart-context";

export function CartView() {
  const { cart, loading, run } = useCart();
  const toast = useToast();
  const [coupon, setCoupon] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  /** Run a cart mutation; errors are surfaced as toasts by the context. */
  async function guard(fn: () => Promise<Cart>) {
    try {
      await run(fn);
    } catch {
      /* already toasted */
    }
  }

  async function onApplyCoupon() {
    if (!coupon) return;
    try {
      await run(() => cartApi.applyCoupon(coupon));
      toast.success(`Coupon “${coupon}” applied`);
      setCoupon("");
    } catch {
      /* already toasted */
    }
  }

  async function onShare() {
    try {
      const updated = await run(() => cartApi.share());
      if (updated.share.token) {
        setShareUrl(`${window.location.origin}/pay/${updated.share.token}`);
        toast.success("Share link created");
      }
    } catch {
      /* already toasted */
    }
  }

  if (loading && !cart) return <p className="text-ink/50">Loading cart…</p>;
  if (!cart || cart.lines.length === 0) {
    return (
      <div className="border border-dashed border-ink/15 bg-white p-16 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
        <Link
          href="/catalog"
          className="mt-4 inline-flex h-11 items-center bg-accent px-6 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="divide-y divide-ink/10 border border-ink/10 bg-white">
        {cart.lines.map((line) => (
          <div key={line.id} className="flex items-center gap-4 p-5">
            <Link
              href={line.product_slug ? `/p/${line.product_slug}` : "#"}
              className="relative h-20 w-20 shrink-0 overflow-hidden border border-ink/10 bg-blush"
            >
              {line.image ? (
                <Image
                  src={line.image}
                  alt={line.product_title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-[10px] text-ink/30">
                  No image
                </span>
              )}
            </Link>
            <div className="flex-1">
              <Link
                href={line.product_slug ? `/p/${line.product_slug}` : "#"}
                className="font-medium text-ink transition hover:text-primary"
              >
                {line.product_title}
              </Link>
              <div className="text-xs text-ink/45">{line.sku}</div>
              {!line.in_stock && (
                <div className="mt-1 text-xs font-medium text-red-600">
                  Insufficient stock
                </div>
              )}
              {line.price_changed && (
                <div className="mt-1 text-xs text-amber-600">
                  Price updated since added
                </div>
              )}
            </div>
            <div className="flex items-center border border-ink/15">
              <button
                type="button"
                aria-label="Decrease"
                className="flex h-8 w-8 items-center justify-center text-ink transition hover:bg-ink/5"
                onClick={() =>
                  guard(() => cartApi.updateItem(line.id, line.quantity - 1))
                }
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">
                {line.quantity}
              </span>
              <button
                type="button"
                aria-label="Increase"
                className="flex h-8 w-8 items-center justify-center text-ink transition hover:bg-ink/5"
                onClick={() =>
                  guard(() => cartApi.updateItem(line.id, line.quantity + 1))
                }
              >
                +
              </button>
            </div>
            <div className="w-24 text-right text-sm font-semibold text-ink">
              {line.line_total.formatted}
            </div>
            <button
              type="button"
              aria-label="Remove"
              className="text-ink/30 transition hover:text-accent"
              onClick={() => guard(() => cartApi.removeItem(line.id))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-ink/10 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">
          Order summary
        </h2>
        <div className="flex justify-between text-sm">
          <span className="text-ink/55">Subtotal</span>
          <span className="font-medium">{cart.subtotal.formatted}</span>
        </div>
        {cart.discounts.applied.map((d) => (
          <div
            key={d.code}
            className="flex justify-between text-sm text-green-700"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="bg-green-100 px-2 py-0.5 text-xs font-medium">
                {d.code}
              </span>
              <button
                type="button"
                className="text-ink/30 hover:text-accent"
                onClick={() => guard(() => cartApi.removeCoupon(d.code))}
              >
                ✕
              </button>
            </span>
            <span>−{d.amount_display.formatted}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-ink/10 pt-4 text-base font-semibold text-ink">
          <span>Total</span>
          <span>{cart.total.formatted}</span>
        </div>

        <div className="mt-1 flex gap-2">
          <Input
            placeholder="Coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <Button type="button" variant="ghost" onClick={onApplyCoupon}>
            Apply
          </Button>
        </div>

        <Link
          href="/checkout"
          className="flex h-12 items-center justify-center bg-accent text-sm font-medium text-white shadow-sm transition hover:bg-accent-hover"
        >
          Checkout
        </Link>

        <div className="border-t border-ink/10 pt-3">
          <OrderChatButton context="cart" />
        </div>

        <button
          type="button"
          onClick={onShare}
          className="text-sm font-medium text-primary hover:text-accent"
        >
          Share cart / Pay for a Friend
        </button>
        {shareUrl && (
          <div className="bg-blush p-3 text-xs text-ink/70">
            Share this link:
            <br />
            <code className="break-all text-primary">{shareUrl}</code>
          </div>
        )}
      </aside>
    </div>
  );
}
