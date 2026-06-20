import { ImageResponse } from "next/og";

import { getStoreConfig } from "@/lib/config";
import { SITE_LOCATION } from "@/lib/seo";

export const alt = "Clothing store & supplier in Lagos, Nigeria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Render on demand (not at build) so @vercel/og has a proper request context.
export const dynamic = "force-dynamic";

// Branded social-share card (shown when the homepage URL is shared).
export default async function OpengraphImage() {
  let name = "Prime Clothings";
  let tagline = "";
  try {
    const cfg = await getStoreConfig();
    name = cfg.name;
    tagline = cfg.tagline;
  } catch {
    /* fall back to defaults */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #6E0D25 0%, #3F0715 100%)",
          color: "#FFF0F3",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#E9B8C2",
          }}
        >
          {SITE_LOCATION}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.02 }}>
            {name}
          </div>
          <div style={{ marginTop: 20, fontSize: 34, color: "#F2D2DA" }}>
            {tagline || "Premium clothing store & supplier in Lagos, Nigeria"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 8, background: "#C9184A" }} />
          <div style={{ fontSize: 26, color: "#E9B8C2" }}>
            Shop the latest fashion · Fast delivery
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
