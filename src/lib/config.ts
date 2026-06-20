import "server-only";

import { cache } from "react";

import { backendFetch } from "./api";

export type HeroConfig = {
  badge: string;
  headline: string;
  subtext: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  backgroundUrl: string;
  /** Brand overlay opacity over the background, 0–1. */
  overlayOpacity: number;
  sideImages: string[];
};

export type StoreConfig = {
  name: string;
  tagline: string;
  supportEmail: string;
  announcement: string;
  /** Delivery URL of the admin-uploaded store logo, or "" to use the wordmark. */
  logoUrl: string;
  /** Public contact phone (order_chat.phone_number), used for SEO/schema. */
  phone: string;
  hero: HeroConfig;
};

const FALLBACK: StoreConfig = {
  name: "IdealCommerce",
  tagline: "Shop the world.",
  supportEmail: "support@idealcommerce.test",
  announcement: "",
  logoUrl: "",
  phone: "",
  hero: {
    badge: "New season · 2026 collection",
    headline: "Shop the world, pay your way.",
    subtext:
      "Curated products, live multi-currency pricing, and a checkout you can even share with a friend.",
    ctaPrimaryLabel: "Shop now",
    ctaPrimaryHref: "/catalog",
    ctaSecondaryLabel: "Explore apparel",
    ctaSecondaryHref: "/catalog?category=apparel",
    backgroundUrl: "",
    overlayOpacity: 0.6,
    sideImages: [],
  },
};

/**
 * The admin-managed store identity (storeconfig public settings).
 * `cache()` dedupes the fetch to one call per server request, no matter how many
 * components read it. Falls back to sensible defaults if the API is unreachable.
 */
export const getStoreConfig = cache(async (): Promise<StoreConfig> => {
  try {
    const data = await backendFetch<{ settings: Record<string, unknown> }>(
      "/config/",
    );
    const s = data.settings ?? {};
    const str = (key: string, fallback: string) =>
      typeof s[key] === "string" && s[key] ? (s[key] as string) : fallback;
    const h = FALLBACK.hero;
    const logoId = str("store.logo_public_id", "");
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
    const logoUrl =
      logoId && cloud
        ? `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,h_80/${logoId}`
        : "";
    const sideImages = Array.isArray(s["hero.side_images"])
      ? (s["hero.side_images"] as unknown[]).filter(
          (u): u is string => typeof u === "string" && u.length > 0,
        )
      : [];
    return {
      name: str("store.name", FALLBACK.name),
      tagline: str("store.tagline", FALLBACK.tagline),
      supportEmail: str("store.support_email", FALLBACK.supportEmail),
      announcement:
        typeof s["content.announcement"] === "string"
          ? (s["content.announcement"] as string)
          : "",
      logoUrl,
      phone: str("order_chat.phone_number", ""),
      hero: {
        badge: str("hero.badge", h.badge),
        headline: str("hero.headline", h.headline),
        subtext: str("hero.subtext", h.subtext),
        ctaPrimaryLabel: str("hero.cta_primary_label", h.ctaPrimaryLabel),
        ctaPrimaryHref: str("hero.cta_primary_href", h.ctaPrimaryHref),
        ctaSecondaryLabel: str("hero.cta_secondary_label", h.ctaSecondaryLabel),
        ctaSecondaryHref: str("hero.cta_secondary_href", h.ctaSecondaryHref),
        backgroundUrl: str("hero.background_url", ""),
        overlayOpacity:
          typeof s["hero.overlay_opacity"] === "number"
            ? Math.min(1, Math.max(0, Number(s["hero.overlay_opacity"]) / 100))
            : h.overlayOpacity,
        sideImages,
      },
    };
  } catch {
    return FALLBACK;
  }
});
