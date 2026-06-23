import { getStoreConfig } from "@/lib/config";

import { HeroClient } from "./hero-client";

function isVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || url.includes("/video/upload/");
}

/**
 * Homepage hero — a full-bleed carousel of admin images (storeconfig `hero.*`:
 * background + side images) with the admin-controlled headline/CTAs overlaid.
 * Compact (≈1/3 viewport) on mobile, immersive on desktop.
 */
export async function Hero() {
  const { hero } = await getStoreConfig();

  // Background + side images become the carousel slides (deduped, fallback last).
  const urls = Array.from(
    new Set([hero.backgroundUrl, ...hero.sideImages].filter(Boolean)),
  );
  const slides = (urls.length ? urls : ["/hero.jpg"]).map((url) => ({
    url,
    isVideo: isVideo(url),
  }));

  return <HeroClient hero={hero} slides={slides} />;
}
