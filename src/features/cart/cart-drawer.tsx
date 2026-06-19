"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { cartApi } from "@/lib/cart-client";
import type { CartLine } from "@/types/cart";

import { useCart } from "./cart-context";

export function CartDrawer() {
  const { cart, isOpen, closeCart, run } = useCart();

  // Close on Escape and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, closeCart]);

  const lines = cart?.lines ?? [];

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!isOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-canvas shadow-2xl transition-transform duration-300 ease-out-expo ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink">
            Shopping bag
            {cart && cart.item_count > 0 && (
              <span className="ml-2 text-ink/40">({cart.item_count})</span>
            )}
          </h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="inline-flex h-9 w-9 items-center justify-center text-ink/60 transition hover:bg-ink/5 hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-ink/55">Your bag is empty.</p>
            <Link
              href="/catalog"
              onClick={closeCart}
              className="inline-flex h-11 items-center bg-ink px-7 text-xs font-semibold uppercase tracking-[0.08em] text-canvas transition hover:bg-primary"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-ink/10 overflow-y-auto px-5">
              {lines.map((line) => (
                <DrawerLine
                  key={line.id}
                  line={line}
                  onChange={(qty) => run(() => cartApi.updateItem(line.id, qty))}
                  onRemove={() => run(() => cartApi.removeItem(line.id))}
                  onNavigate={closeCart}
                />
              ))}
            </div>

            <footer className="border-t border-ink/10 bg-white px-5 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/55">Subtotal</span>
                <span className="font-semibold text-ink">
                  {cart?.subtotal.formatted}
                </span>
              </div>
              {cart && cart.discounts.applied.length > 0 && (
                <div className="mt-1 flex items-center justify-between text-sm text-green-700">
                  <span>Discounts</span>
                  <span>−{cart.discounts.total.formatted}</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-3 text-base font-semibold text-ink">
                <span>Total</span>
                <span>{cart?.total.formatted}</span>
              </div>
              <p className="mt-1 text-xs text-ink/45">
                Shipping &amp; taxes calculated at checkout.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex h-12 items-center justify-center bg-ink text-xs font-semibold uppercase tracking-[0.08em] text-canvas transition hover:bg-primary"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex h-11 items-center justify-center border border-ink/15 bg-white text-xs font-semibold uppercase tracking-[0.08em] text-ink transition hover:border-ink"
                >
                  View bag
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

function DrawerLine({
  line,
  onChange,
  onRemove,
  onNavigate,
}: {
  line: CartLine;
  onChange: (qty: number) => void;
  onRemove: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="flex gap-4 py-4">
      <Link
        href={line.product_slug ? `/p/${line.product_slug}` : "#"}
        onClick={onNavigate}
        className="relative h-20 w-20 shrink-0 overflow-hidden border border-ink/10 bg-white"
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

      <div className="flex flex-1 flex-col">
        <Link
          href={line.product_slug ? `/p/${line.product_slug}` : "#"}
          onClick={onNavigate}
          className="text-sm font-medium text-ink transition hover:text-primary"
        >
          {line.product_title}
        </Link>
        <div className="text-xs text-ink/45">{line.sku}</div>
        {!line.in_stock && (
          <div className="mt-0.5 text-xs font-medium text-red-600">
            Insufficient stock
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center border border-ink/15">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onChange(line.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center text-ink transition hover:bg-ink/5"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onChange(line.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center text-ink transition hover:bg-ink/5"
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold text-ink">
            {line.line_total.formatted}
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Remove item"
        onClick={onRemove}
        className="self-start text-ink/30 transition hover:text-accent"
      >
        ✕
      </button>
    </div>
  );
}
