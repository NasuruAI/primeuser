"use client";

import { parseApiError } from "@/lib/api-error";
import type { Cart } from "@/types/cart";

/**
 * Client-side cart API, routed through the authed proxy so it works for both
 * logged-in users (Bearer token) and guests (Django session cookie).
 */
const base = "/api/proxy/cart";

async function call(path: string, init: RequestInit = {}): Promise<Cart> {
  const res = await fetch(`${base}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw await parseApiError(res);
  return (await res.json()) as Cart;
}

export const cartApi = {
  get: (currency?: string) =>
    call(`/${currency ? `?currency=${currency}` : ""}`),
  addItem: (variant: string, quantity = 1) =>
    call("/items/", {
      method: "POST",
      body: JSON.stringify({ variant, quantity }),
    }),
  updateItem: (lineId: string, quantity: number) =>
    call(`/items/${lineId}/`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),
  removeItem: (lineId: string) =>
    call(`/items/${lineId}/`, { method: "DELETE" }),
  applyCoupon: (code: string) =>
    call("/coupons/", { method: "POST", body: JSON.stringify({ code }) }),
  removeCoupon: (code: string) =>
    call(`/coupons/${code}/`, { method: "DELETE" }),
  share: (expiresInHours?: number) =>
    call("/share/", {
      method: "POST",
      body: JSON.stringify(
        expiresInHours ? { expires_in_hours: expiresInHours } : {},
      ),
    }),
  revokeShare: () => call("/share/", { method: "DELETE" }),
};
