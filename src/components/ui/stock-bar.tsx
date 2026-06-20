/**
 * "Items left" indicator: a bar that's full when freshly stocked and depletes
 * as units sell, plus the remaining count. Renders nothing for products without
 * tracked stock (e.g. dropship), where `full` is 0.
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

  const out = available <= 0;
  const pct = out ? 0 : Math.max(6, Math.round((available / full) * 100));
  const low = !out && available / full <= 0.25;

  const color = out ? "bg-ink/20" : low ? "bg-accent" : "bg-green-500";

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[11px]">
        {out ? (
          <span className="font-semibold uppercase tracking-wide text-ink/45">
            Out of stock
          </span>
        ) : (
          <span className={low ? "font-semibold text-accent" : "text-ink/55"}>
            {low ? `Only ${available} left` : `${available} left`}
          </span>
        )}
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function FlashBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 bg-yellow-400 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-ink ${className}`}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
      Flash
    </span>
  );
}
