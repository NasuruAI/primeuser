"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { ProductListItem } from "@/types/catalog";

function readCurrency(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)ic_currency=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

/** Header search with real-time instant results as you type. */
export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("search") ?? "");
  const [results, setResults] = useState<ProductListItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced live search.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const cur = readCurrency();
        const qs = new URLSearchParams({ search: term });
        if (cur) qs.set("currency", cur);
        const res = await fetch(`/api/proxy/catalog/products/?${qs}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setResults((data.results ?? data ?? []).slice(0, 6));
        setActive(-1);
      } catch {
        /* aborted or failed — leave previous results */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  // Close on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (active >= 0 && results[active]) {
      go(`/p/${results[active].slug}`);
      return;
    }
    go(term ? `/catalog?search=${encodeURIComponent(term)}` : "/catalog");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showPanel = open && q.trim().length >= 2;

  return (
    <div ref={boxRef} className="relative hidden flex-1 md:block">
      <form onSubmit={submit} role="search" className="w-full max-w-sm">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search products…"
            aria-label="Search products"
            autoComplete="off"
            className="h-9 w-full border border-ink/15 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink/10"
          />
        </div>
      </form>

      {/* Instant results */}
      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-w-sm border border-ink/10 bg-white shadow-card">
          {loading && results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-ink/45">
              Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-ink/45">
              No matches for “{q.trim()}”.
            </div>
          ) : (
            <>
              <ul>
                {results.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(`/p/${p.slug}`)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        active === i ? "bg-blush" : "hover:bg-blush/60"
                      }`}
                    >
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden bg-blush">
                        {p.primary_image && (
                          <Image
                            src={p.primary_image.thumb}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">
                          {p.title}
                        </span>
                        {p.price_from_display && (
                          <span className="text-xs text-ink/55">
                            {p.price_from_display.formatted}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <Link
                href={`/catalog?search=${encodeURIComponent(q.trim())}`}
                onClick={() => setOpen(false)}
                className="block border-t border-ink/10 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-primary transition hover:bg-blush/60"
              >
                See all results
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
