/**
 * "Items left" indicator: a very thin line that fills with remaining stock, with
 * the count riding at the line's tip — so the number slides left as units sell,
 * until it's out of stock. Renders nothing for products without tracked stock
 * (e.g. dropship), where `full` is 0.
 */
export function StockBar({
  available,
  full,
  className = "",
}: {
  available: number;
  full: number;
  className?: string;
}) {
  if (full <= 0) return null;

  if (available <= 0) {
    return (
      <div className={className}>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-ink/40">
          Out of stock
        </span>
      </div>
    );
  }

  const ratio = Math.min(1, available / full);
  const pct = Math.max(3, Math.round(ratio * 100)); // fill + tip position
  const low = ratio <= 0.25;
  const labelPos = Math.min(93, Math.max(7, pct)); // keep the number readable at the extremes
  const fill = low ? "bg-accent" : "bg-green-500";
  const text = low ? "text-accent" : "text-ink/60";

  return (
    <div className={className}>
      <div className="relative h-4">
        {/* count, riding just above the tip */}
        <span
          className={`absolute top-0 -translate-x-1/2 text-[10px] font-semibold tabular-nums ${text}`}
          style={{ left: `${labelPos}%` }}
        >
          {available}
        </span>
        {/* full-width hairline track */}
        <span className="absolute inset-x-0 bottom-1 h-px bg-ink/10" />
        {/* filled portion */}
        <span
          className={`absolute bottom-1 left-0 h-px ${fill} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
        {/* tip marker */}
        <span
          className={`absolute bottom-1 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full ${fill} transition-all duration-500`}
          style={{ left: `${pct}%` }}
        />
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
