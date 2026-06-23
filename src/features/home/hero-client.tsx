"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { HeroConfig } from "@/lib/config";

type Slide = { url: string; isVideo: boolean };

const ROTATE_MS = 5500;

export function HeroClient({
  hero,
  slides,
}: {
  hero: HeroConfig;
  slides: Slide[];
}) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), ROTATE_MS);
    return () => clearInterval(t);
  }, [n]);

  const go = (next: number) => setI(((next % n) + n) % n);

  return (
    <section className="relative overflow-hidden bg-[#3F0715] text-blush">
      {/* Rotating background slides */}
      <div className="absolute inset-0">
        {slides.map((s, idx) => (
          <div
            key={idx}
            aria-hidden={idx !== i}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
          >
            {s.isVideo ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                className="h-full w-full object-cover"
                src={s.url}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div
                className="h-full w-full scale-105 bg-cover bg-center"
                style={{ backgroundImage: `url(${s.url})` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Brand + legibility overlays */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-br from-primary via-primary/95 to-[#2C0510]"
        style={{ opacity: hero.overlayOpacity }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-t from-[#2C0510]/80 via-transparent to-transparent"
        aria-hidden
      />

      {/* Content — compact (≈1/3 height) on mobile, full on desktop */}
      <div className="container-site relative z-20 flex h-[33vh] flex-col justify-center py-6 sm:h-auto sm:py-24 lg:min-h-[86vh] lg:py-28">
        <div className="max-w-xl animate-fade-up">
          {hero.badge && (
            <div className="mb-3 flex items-center gap-3 sm:mb-6">
              <span className="h-px w-6 bg-blush/40 sm:w-8" />
              <span className="text-[10px] font-semibold uppercase tracking-eyebrow text-blush/80 sm:text-[11px]">
                {hero.badge}
              </span>
            </div>
          )}
          {hero.headline && (
            <h1 className="font-display text-3xl font-bold leading-[1.02] tracking-[-0.01em] sm:text-5xl sm:leading-[0.98] lg:text-7xl">
              {hero.headline}
            </h1>
          )}
          {hero.subtext && (
            <p className="mt-4 hidden max-w-md text-lg leading-relaxed text-blush/75 sm:block">
              {hero.subtext}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-9 sm:gap-x-7">
            {hero.ctaPrimaryLabel && (
              <Link
                href={hero.ctaPrimaryHref || "/catalog"}
                className="group inline-flex items-center gap-2 rounded-lg bg-blush px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink shadow-soft transition hover:bg-white sm:px-8 sm:py-4 sm:text-sm"
              >
                {hero.ctaPrimaryLabel}
                <span className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}
            {hero.ctaSecondaryLabel && (
              <Link
                href={hero.ctaSecondaryHref || "/catalog"}
                className="link-underline hidden text-sm font-medium uppercase tracking-[0.08em] text-blush/90 hover:text-blush sm:inline"
              >
                {hero.ctaSecondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Arrows (desktop) */}
      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(i - 1)}
            className="absolute left-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-blush backdrop-blur transition hover:bg-white/20 lg:flex"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(i + 1)}
            className="absolute right-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-blush backdrop-blur transition hover:bg-white/20 lg:flex"
          >
            <Chevron dir="right" />
          </button>
        </>
      )}

      {/* Dots */}
      {n > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 sm:bottom-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === i}
              onClick={() => go(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === i
                  ? "w-6 bg-blush"
                  : "w-1.5 bg-blush/40 hover:bg-blush/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
