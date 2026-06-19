"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

import { useFavourites } from "@/features/favourites/favourites-context";

import { CartBadge } from "./cart-badge";
import { CurrencyMenu } from "./currency-menu";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";

const NAV = [
  { href: "/catalog", label: "Shop" },
  { href: "/catalog?category=apparel", label: "Apparel" },
  { href: "/catalog?sort=newest", label: "New in" },
];

export function Header({
  storeName,
  announcement,
}: {
  storeName: string;
  announcement: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count: favCount } = useFavourites();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      {announcement && (
        <div className="bg-ink text-center text-[11px] font-medium uppercase tracking-[0.12em] text-canvas">
          <div className="container-site py-2">{announcement}</div>
        </div>
      )}

      <div
        className={`border-b transition-colors duration-300 ${
          scrolled
            ? "border-ink/10 bg-canvas/85 backdrop-blur-md"
            : "border-transparent bg-canvas"
        }`}
      >
        <div className="container-site flex h-16 items-center gap-6">
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="-ml-1.5 inline-flex h-9 w-9 items-center justify-center text-ink transition hover:text-primary lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              {mobileOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>

          <Logo storeName={storeName} />

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="link-underline text-[13px] font-medium uppercase tracking-[0.08em] text-ink/70 transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Suspense fallback={<div className="hidden flex-1 md:block" />}>
            <SearchBar />
          </Suspense>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <CurrencyMenu />
            <Link
              href="/account/favourites"
              aria-label="Favourites"
              className="relative inline-flex h-9 w-9 items-center justify-center text-ink transition hover:text-primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5.5 5.5 5.5c1.9 0 3.2 1.1 3.9 2.2.6-1.1 2-2.2 3.9-2.2 3 0 4.5 3 3 6C19 15.65 12 20 12 20Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              {favCount > 0 && (
                <span className="absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[10px] font-semibold text-white">
                  {favCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="inline-flex h-9 w-9 items-center justify-center text-ink transition hover:text-primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M5 20a7 7 0 0 1 14 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
            <CartBadge />
          </div>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileOpen && (
        <nav className="border-b border-ink/10 bg-canvas lg:hidden">
          <div className="container-site flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-ink/5 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-ink/80 transition hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-ink/80 transition hover:text-primary"
            >
              My account
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
