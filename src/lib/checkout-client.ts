"use client";

import { parseApiError } from "@/lib/api-error";
import type { Order, Shipping } from "@/types/order";

/** Client-side checkout/orders API via the authed proxy (Bearer or guest session). */
async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw await parseApiError(res);
  return (await res.json()) as T;
}

function newIdempotencyKey(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export const checkoutApi = {
  /** Owner checkout of their own cart. */
  checkout: (body: {
    currency?: string;
    shipping?: Shipping;
    contact?: { email?: string; name?: string };
    /** Use a saved address book entry instead of inline shipping. */
    address_id?: string;
    /** Save the inline shipping to the signed-in user's address book. */
    save_address?: boolean;
  }) =>
    call<Order>("/checkout/", {
      method: "POST",
      body: JSON.stringify({ ...body, idempotency_key: newIdempotencyKey() }),
    }),

  /** Pay-for-a-Friend checkout of a shared cart. */
  checkoutShared: (
    token: string,
    body: {
      currency?: string;
      payer?: { email?: string; name?: string };
      shipping?: Shipping;
    },
  ) =>
    call<Order>(`/checkout/shared/${token}/`, {
      method: "POST",
      body: JSON.stringify({ ...body, idempotency_key: newIdempotencyKey() }),
    }),

  /** Mock-provider confirmation (drives the order to paid in dev). */
  confirm: (orderNumber: string) =>
    call<{ status: string }>("/payments/confirm/", {
      method: "POST",
      body: JSON.stringify({ order_number: orderNumber }),
    }),

  getOrder: (number: string) => call<Order>(`/orders/${number}/`),
  history: () => call<Order[]>("/orders/"),
};
