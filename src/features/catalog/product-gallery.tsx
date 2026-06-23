"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ProductImage } from "@/types/catalog";

const SWIPE_THRESHOLD = 40; // px before a drag counts as a swipe

export function ProductGallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = images.length;

  // Wrap-around navigation so the counter loops back to 1 after the last image.
  const go = useCallback(
    (delta: number) => {
      setActive((i) => (count ? (i + delta + count) % count : 0));
    },
    [count],
  );

  // Keyboard: arrows navigate; Esc closes the expanded view.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") setZoomed(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    if (!zoomed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [zoomed]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  const current = images[active];

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center border border-ink/10 bg-white text-ink/30">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
      {/* Thumbnail filmstrip — horizontal under the image on mobile, a vertical
          rail beside it on desktop */}
      {count > 1 && (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto sm:max-h-[72vh] sm:w-16 sm:flex-col sm:overflow-y-auto lg:w-20">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border bg-white transition sm:w-full ${
                i === active
                  ? "border-primary ring-1 ring-primary"
                  : "border-ink/10 hover:border-ink/40"
              }`}
            >
              <Image
                src={img.urls.thumb}
                alt={img.alt_text || `${title} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image — swipeable, click to expand */}
      <div
        className="group relative aspect-square max-h-[72vh] w-full flex-1 select-none overflow-hidden rounded-xl border border-ink/10 bg-white"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label="Expand image"
          className="absolute inset-0 z-[1] cursor-zoom-in"
        />
        <Image
          src={current.urls.detail}
          alt={current.alt_text || title}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-contain transition-transform duration-300"
          priority
        />

        {count > 1 && (
          <>
            {/* Prev / next arrows (desktop hover; always visible on touch) */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-[2] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-[2] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
            >
              ›
            </button>

            {/* Counter */}
            <span className="absolute bottom-2 right-2 z-[2] rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-white">
              {active + 1} / {count}
            </span>
          </>
        )}
      </div>

      {/* Lightbox — click anywhere outside the image (or Esc) to close */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — expanded image`}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Close"
            className="absolute right-4 top-4 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25"
          >
            ✕
          </button>

          {/* Stop propagation so clicking the image itself doesn't close. */}
          <div
            className="relative h-full max-h-[88vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={current.urls.detail}
              alt={current.alt_text || title}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25"
                >
                  ›
                </button>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white">
                  {active + 1} / {count}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
