"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  AddressDraft,
  AddressFields,
  EMPTY_ADDRESS,
  isAddressComplete,
} from "@/features/account/address-fields";
import { OrderChatButton } from "@/features/order-chat/order-chat-button";
import { OrderSummary } from "@/features/orders/order-summary";
import { addressApi } from "@/lib/address-client";
import { cartApi } from "@/lib/cart-client";
import { checkoutApi } from "@/lib/checkout-client";
import type { Address } from "@/types/address";
import type { Cart } from "@/types/cart";
import type { Order, Shipping } from "@/types/order";

function summarise(a: Address): string {
  return [a.line1, a.line2, a.city, a.region, a.postal_code, a.country]
    .filter(Boolean)
    .join(", ");
}

const NEW = "__new__";

export function CheckoutForm() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  // Address book state.
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selected, setSelected] = useState<string>(NEW); // address id or NEW
  const [newAddress, setNewAddress] = useState<AddressDraft>(EMPTY_ADDRESS);
  const [saveNew, setSaveNew] = useState(true);
  const [contactEmail, setContactEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);

  useEffect(() => {
    cartApi
      .get()
      .then(setCart)
      .catch(() => setCart(null));

    // Am I signed in? (drives whether we offer to save the address)
    fetch("/api/proxy/auth/me/")
      .then((r) => setLoggedIn(r.ok))
      .catch(() => setLoggedIn(false));

    addressApi.list().then((list) => {
      setAddresses(list);
      if (list.length > 0) {
        const def = list.find((a) => a.is_default) ?? list[0];
        setSelected(def.id);
      }
    });
  }, []);

  const usingNew = selected === NEW;

  async function refreshCart() {
    const fresh = await cartApi.get().catch(() => null);
    if (fresh) setCart(fresh);
    window.dispatchEvent(new Event("ic:cart-refresh"));
  }

  async function applyCoupon() {
    const code = coupon.trim();
    if (!code) return;
    setCouponBusy(true);
    try {
      await cartApi.applyCoupon(code);
      toast.success(`Coupon “${code}” applied`);
      setCoupon("");
      await refreshCart();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "That coupon couldn’t be applied.");
    } finally {
      setCouponBusy(false);
    }
  }

  async function removeCoupon(code: string) {
    setCouponBusy(true);
    try {
      await cartApi.removeCoupon(code);
      await refreshCart();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn’t remove that coupon.");
    } finally {
      setCouponBusy(false);
    }
  }

  async function placeAndPay() {
    // Validate the destination before hitting the gateway.
    if (usingNew && !isAddressComplete(newAddress)) {
      toast.error("Please fill in name, address, city and country.");
      return;
    }
    setBusy(true);
    try {
      const shipping: Shipping | undefined = usingNew
        ? {
            name: newAddress.name,
            line1: newAddress.line1,
            line2: newAddress.line2,
            city: newAddress.city,
            region: newAddress.region,
            postal_code: newAddress.postal_code,
            country: newAddress.country,
            phone: newAddress.phone,
          }
        : undefined;

      const created = await checkoutApi.checkout({
        contact: contactEmail ? { email: contactEmail } : undefined,
        ...(usingNew
          ? { shipping, save_address: loggedIn && saveNew }
          : { address_id: selected }),
      });
      window.dispatchEvent(new Event("ic:cart-refresh"));

      const authUrl = created.payment?.authorization_url;
      if (authUrl) {
        window.location.href = authUrl;
        return;
      }

      await checkoutApi.confirm(created.number);
      setOrder(await checkoutApi.getOrder(created.number).catch(() => created));
      toast.success("Order placed — payment confirmed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  }

  if (order) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h2 className="font-display text-3xl font-bold text-ink">
          Order confirmed
        </h2>
        <p className="mt-1 text-ink/55">
          Thank you! A confirmation is on its way to your inbox.
        </p>
        <div className="mt-6 text-left">
          <OrderSummary order={order} />
        </div>
        <Link
          href="/catalog"
          className="mt-6 inline-flex h-11 items-center bg-ink px-7 text-xs font-semibold uppercase tracking-[0.08em] text-canvas transition hover:bg-primary"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="border border-dashed border-ink/15 bg-white p-16 text-center">
        <p className="text-ink/60">Your bag is empty.</p>
        <Link
          href="/catalog"
          className="mt-5 inline-flex h-11 items-center bg-ink px-7 text-xs font-semibold uppercase tracking-[0.08em] text-canvas transition hover:bg-primary"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  const hasSaved = addresses.length > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">
          Shipping destination
        </h2>
        <p className="mb-5 mt-1 text-sm text-ink/55">
          {hasSaved
            ? "Choose a saved address or add a new one."
            : "Where should we send your order?"}
        </p>

        {/* Saved addresses — pick one, or choose to add a new address. */}
        {hasSaved && (
          <div className="mb-5 flex flex-col gap-3">
            {addresses.map((a) => (
              <label
                key={a.id}
                className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
                  selected === a.id
                    ? "border-primary ring-1 ring-primary"
                    : "border-ink/15 hover:border-ink/30"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mt-1"
                  checked={selected === a.id}
                  onChange={() => setSelected(a.id)}
                />
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-ink">{a.name}</span>
                    {a.label && (
                      <span className="bg-surface px-2 py-0.5 text-[11px] text-ink/60">
                        {a.label}
                      </span>
                    )}
                    {a.is_default && (
                      <span className="bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        Default
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink/60">
                    {summarise(a)}
                  </span>
                </span>
              </label>
            ))}

            <label
              className={`flex cursor-pointer items-center gap-3 border border-dashed p-4 transition ${
                usingNew
                  ? "border-primary ring-1 ring-primary"
                  : "border-ink/20 hover:border-ink/30"
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={usingNew}
                onChange={() => setSelected(NEW)}
              />
              <span className="text-sm font-medium text-ink">
                + Use a new address
              </span>
            </label>
          </div>
        )}

        {/* New-address form (always shown for guests / when "new" is picked). */}
        {usingNew && (
          <div className="flex flex-col gap-4">
            <AddressFields value={newAddress} onChange={setNewAddress} />
            {loggedIn && (
              <label className="flex items-center gap-2 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={saveNew}
                  onChange={(e) => setSaveNew(e.target.checked)}
                />
                Save this address to my account
              </label>
            )}
          </div>
        )}

        {/* Contact email */}
        <div className="mt-5 border-t border-ink/10 pt-5">
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Contact email
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-ink/10 bg-white p-6 lg:sticky lg:top-24">
        <span className="eyebrow">Summary</span>
        <h2 className="-mt-2 font-display text-xl font-bold text-ink">Your order</h2>
        <div className="flex flex-col gap-1.5 text-sm">
          {cart.lines.map((l) => (
            <div key={l.id} className="flex justify-between">
              <span className="text-ink/70">
                {l.product_title}{" "}
                <span className="text-ink/40">×{l.quantity}</span>
              </span>
              <span className="text-ink">{l.line_total.formatted}</span>
            </div>
          ))}
        </div>
        {cart.discounts.applied.map((d) => (
          <div
            key={d.code}
            className="flex justify-between text-sm text-green-700"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium">
                {d.code}
              </span>
              <button
                type="button"
                aria-label={`Remove ${d.code}`}
                className="text-ink/30 transition hover:text-accent"
                disabled={couponBusy}
                onClick={() => removeCoupon(d.code)}
              >
                ✕
              </button>
            </span>
            <span>−{d.amount_display.formatted}</span>
          </div>
        ))}

        {/* Coupon */}
        <div className="flex gap-2">
          <Input
            placeholder="Coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyCoupon();
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={applyCoupon}
            disabled={couponBusy || !coupon.trim()}
          >
            {couponBusy ? "…" : "Apply"}
          </Button>
        </div>

        <div className="flex justify-between border-t border-ink/10 pt-4 text-base font-semibold text-ink">
          <span>Total</span>
          <span>{cart.total.formatted}</span>
        </div>
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={placeAndPay}
          disabled={busy}
        >
          {busy ? "Processing…" : "Place order & pay"}
        </Button>
        <p className="text-center text-xs text-ink/45">
          Secure checkout · mock payment in dev
        </p>

        <div className="border-t border-ink/10 pt-4">
          <OrderChatButton context="checkout" />
        </div>
      </aside>
    </div>
  );
}
