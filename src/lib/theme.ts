/** "#6E0D25" -> "110 13 37" (space-separated RGB channels for CSS vars). */
export function hexToRgbChannels(hex: string, fallback: string): string {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return fallback;
  let h = m[1];
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export const DEFAULT_PRIMARY_CHANNELS = "110 13 37"; // #6E0D25
export const DEFAULT_ACCENT_CHANNELS = "201 24 74"; // #C9184A

/** Inline CSS-variable style for the document root, derived from brand hex. */
export function brandStyle(primaryHex: string, accentHex: string) {
  return {
    "--brand-primary": hexToRgbChannels(primaryHex, DEFAULT_PRIMARY_CHANNELS),
    "--brand-accent": hexToRgbChannels(accentHex, DEFAULT_ACCENT_CHANNELS),
  } as React.CSSProperties;
}
