/**
 * Circular "items left" indicator: a brand-coloured ring with the remaining
 * count in the middle. The ring arc clears (shrinks) as stock sells down, until
 * it's out of stock. Renders nothing for products without tracked stock (e.g.
 * dropship), where `full` is 0.
 */
export function StockRing({
  available,
  full,
  className = "",
}: {
  available: number;
  full: number;
  className?: string;
}) {
  if (full <= 0) return null;

  const out = available <= 0;
  const ratio = out ? 0 : Math.min(1, available / full);
  const R = 15.5;
  const C = 2 * Math.PI * R;
  const dash = C * ratio;

  return (
    <div
      className={`h-10 w-10 ${className}`}
      title={out ? "Out of stock" : `${available} left`}
      aria-label={out ? "Out of stock" : `${available} in stock`}
    >
      {/* inner wrapper owns the positioning context for the count, so the
          caller's className fully controls where the ring sits */}
      <div className="relative h-full w-full">
        <svg
          viewBox="0 0 40 40"
          className="h-full w-full -rotate-90 text-primary"
        >
          {/* solid disc so the count stays legible over the product image */}
          <circle cx="20" cy="20" r={R + 2.5} fill="white" />
          {/* faint full track */}
          <circle
            cx="20"
            cy="20"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={3}
          />
          {/* remaining-stock arc (brand colour) */}
          {!out && (
            <circle
              cx="20"
              cy="20"
              r={R}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C - dash}`}
              className="transition-[stroke-dasharray] duration-500"
            />
          )}
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-ink">
          {available}
        </span>
      </div>
    </div>
  );
}

export function FlashBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-ink ${className}`}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
      Flash
    </span>
  );
}
