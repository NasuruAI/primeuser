"use client";

import type { Address, AddressInput } from "@/types/address";

/** Saved-address book API via the authed proxy (requires a signed-in user). */
async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`);
  }
  // DELETE / set-default may return 204 No Content.
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const addressApi = {
  /** List the signed-in user's addresses ([] for guests / on error). */
  list: async (): Promise<Address[]> => {
    try {
      const r = await call<{ results?: Address[] } | Address[]>(
        "/auth/addresses/",
      );
      return Array.isArray(r) ? r : (r.results ?? []);
    } catch {
      return [];
    }
  },
  create: (body: AddressInput) =>
    call<Address>("/auth/addresses/", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: Partial<AddressInput>) =>
    call<Address>(`/auth/addresses/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    call<void>(`/auth/addresses/${id}/`, { method: "DELETE" }),
  setDefault: (id: string) =>
    call<Address>(`/auth/addresses/${id}/set-default/`, { method: "POST" }),
};
