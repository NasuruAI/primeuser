"use client";

import { useState } from "react";

import {
  OrderChatContext,
  requestOrderChat,
  useOrderChatConfig,
} from "@/lib/order-chat";

type Channel = "telegram" | "whatsapp" | "call";

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.9 4.3 18.7 19.4c-.24 1.08-.88 1.35-1.78.84l-4.92-3.63-2.37 2.28c-.26.26-.48.48-.99.48l.35-5 9.1-8.22c.4-.35-.09-.55-.62-.2L5.2 13.04l-4.85-1.52c-1.05-.33-1.07-1.05.22-1.56l18.96-7.3c.88-.33 1.65.2 1.36 1.64z" />
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.9.9-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-5.6c-.24-.12-1.4-.7-1.62-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94-.28.18-.52.06a6.5 6.5 0 0 1-1.92-1.18 7.2 7.2 0 0 1-1.32-1.65c-.14-.24 0-.36.1-.48l.36-.42c.12-.14.16-.24.24-.4a.44.44 0 0 0-.02-.42c-.06-.12-.54-1.3-.74-1.78-.2-.46-.4-.4-.54-.4h-.46a.9.9 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2c0 1.18.86 2.32.98 2.48s1.7 2.6 4.12 3.64c2.42 1.04 2.42.7 2.86.66s1.4-.58 1.6-1.14.2-1.04.14-1.14-.22-.16-.46-.28z" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" strokeLinejoin="round" />
    </svg>
  );
}

// Brand-accurate channel colours (Telegram blue, WhatsApp green, on-brand call).
const STYLES: Record<Channel, string> = {
  telegram: "bg-[#229ED9] hover:bg-[#1B86B8]",
  whatsapp: "bg-[#25D366] hover:bg-[#1EBE5A]",
  call: "bg-primary hover:bg-primary-800",
};
const ICONS: Record<Channel, React.ReactNode> = {
  telegram: <TelegramIcon />,
  whatsapp: <WhatsappIcon />,
  call: <PhoneIcon />,
};
const LABELS: Record<Channel, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  call: "Call",
};

export function OrderChatButton({
  context,
  variantId,
  quantity = 1,
  className = "",
}: {
  context: OrderChatContext;
  variantId?: string;
  quantity?: number;
  className?: string;
}) {
  const cfg = useOrderChatConfig();
  const [busy, setBusy] = useState<Channel | null>(null);

  if (!cfg?.enabled) return null;

  const channels: Channel[] = [
    cfg.telegramUrl ? "telegram" : null,
    cfg.whatsappNumber ? "whatsapp" : null,
    cfg.phoneNumber ? "call" : null,
  ].filter(Boolean) as Channel[];

  if (channels.length === 0) return null;

  async function go(channel: Channel) {
    setBusy(channel);
    try {
      const url = await requestOrderChat({
        channel,
        context,
        variant: variantId,
        quantity,
      });
      // Fall back to a bare link if the API didn't return one.
      const fallback =
        channel === "telegram"
          ? cfg!.telegramUrl
          : channel === "whatsapp"
            ? `https://wa.me/${cfg!.whatsappNumber.replace(/\D/g, "")}`
            : `tel:${cfg!.phoneNumber}`;
      const target = url || fallback;
      if (channel === "call") window.location.href = target;
      else window.open(target, "_blank", "noopener");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {cfg.note && (
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-ink/55">
          {cfg.note}
        </p>
      )}
      <div className="flex flex-wrap items-start gap-5">
        {channels.map((ch) => (
          <button
            key={ch}
            type="button"
            onClick={() => go(ch)}
            disabled={busy !== null}
            aria-label={ch === "call" ? "Call to order" : `Order on ${LABELS[ch]}`}
            title={ch === "call" ? "Call to order" : `Order on ${LABELS[ch]}`}
            className="group flex flex-col items-center gap-1.5 disabled:opacity-60"
          >
            <span
              style={{ borderRadius: "9999px" }}
              className={`flex h-12 w-12 items-center justify-center text-white shadow-soft ring-1 ring-black/5 transition-transform duration-200 ease-out-expo group-hover:-translate-y-0.5 group-hover:scale-105 ${STYLES[ch]} ${
                busy === ch ? "animate-pulse" : ""
              }`}
            >
              {ICONS[ch]}
            </span>
            <span className="text-[11px] font-medium text-ink/60">
              {LABELS[ch]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
