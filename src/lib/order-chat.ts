"use client";

import { useEffect, useState } from "react";

export type OrderChatConfig = {
  enabled: boolean;
  telegramUrl: string;
  whatsappNumber: string;
  phoneNumber: string;
  note: string;
};

const EMPTY: OrderChatConfig = {
  enabled: false,
  telegramUrl: "",
  whatsappNumber: "",
  phoneNumber: "",
  note: "",
};

let cache: OrderChatConfig | null = null;
let inflight: Promise<OrderChatConfig> | null = null;

function parse(settings: Record<string, unknown>): OrderChatConfig {
  const str = (k: string) =>
    typeof settings[k] === "string" ? (settings[k] as string) : "";
  const raw = settings["order_chat.enabled"];
  return {
    enabled: raw === true || raw === "true" || raw === 1,
    telegramUrl: str("order_chat.telegram_url"),
    whatsappNumber: str("order_chat.whatsapp_number"),
    phoneNumber: str("order_chat.phone_number"),
    note: str("order_chat.note"),
  };
}

async function fetchConfig(): Promise<OrderChatConfig> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/api/proxy/config/")
      .then((r) => (r.ok ? r.json() : { settings: {} }))
      .then((d) => {
        cache = parse(d?.settings ?? {});
        return cache;
      })
      .catch(() => EMPTY);
  }
  return inflight;
}

/** Read the admin-configured chat-to-order settings (cached per session). */
export function useOrderChatConfig(): OrderChatConfig | null {
  const [cfg, setCfg] = useState<OrderChatConfig | null>(cache);
  useEffect(() => {
    let alive = true;
    fetchConfig().then((c) => alive && setCfg(c));
    return () => {
      alive = false;
    };
  }, []);
  return cfg;
}

export type OrderChatContext = "product" | "cart" | "checkout";

/**
 * Record the lead (sends details to the store's Telegram ops chat) and return
 * the deep link to open for the chosen channel (prefilled where supported).
 */
export async function requestOrderChat(input: {
  channel: "telegram" | "whatsapp" | "call";
  context: OrderChatContext;
  variant?: string;
  quantity?: number;
  customer_name?: string;
  customer_phone?: string;
  note?: string;
}): Promise<string | null> {
  try {
    const res = await fetch("/api/proxy/order-chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.links?.[input.channel] ?? null;
  } catch {
    return null;
  }
}
