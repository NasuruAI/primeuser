import Link from "next/link";

/**
 * Store logo — an on-brand wordmark driven by the admin's store name
 * (storeconfig `store.name`), with the shopping-bag mark.
 */
export function Logo({
  storeName,
  className = "",
}: {
  storeName: string;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${storeName} home`}
      className={`flex items-center gap-2 ${className}`}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 8h14l-1 12H6L5 8Z"
          stroke="#1A1A2E"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M8.5 8a3.5 3.5 0 0 1 7 0" stroke="#1A1A2E" strokeWidth="1.6" />
        <path
          d="M9 12c2 2.5 3.5 3.5 6 4.5"
          stroke="#B58A4B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      {/* Wordmark hidden on mobile — the mark alone represents the brand there. */}
      <span className="hidden font-display text-xl font-bold tracking-tight text-ink sm:inline">
        {storeName}
      </span>
    </Link>
  );
}
