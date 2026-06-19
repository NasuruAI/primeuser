import Link from "next/link";

import { getStoreConfig } from "@/lib/config";

/**
 * Homepage hero — fully admin-controlled (storeconfig `hero.*`): badge,
 * headline, subtext, both CTAs, the background image, and the side-stack images.
 */
export async function Hero() {
  const { hero } = await getStoreConfig();
  const bg = hero.backgroundUrl || "/hero.jpg";
  const bgIsVideo =
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(bg) || bg.includes("/video/upload/");
  const sides = hero.sideImages.slice(0, 3);
  const slots = [
    "right-0 top-0 z-10 rotate-2",
    "right-28 top-12 z-0 -rotate-3",
    "right-14 top-4 z-20",
  ];

  return (
    <section className="relative overflow-hidden bg-[#3F0715] text-blush">
      {/* Background (image or video) */}
      {bgIsVideo ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={bg}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden
        />
      )}
      {/* Admin-controlled brand overlay + an extra depth gradient at the edges. */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-[#2C0510]"
        style={{ opacity: hero.overlayOpacity }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#2C0510]/70 via-transparent to-transparent"
        aria-hidden
      />

      <div className="container-site relative grid items-center gap-12 py-24 lg:min-h-[86vh] lg:grid-cols-[1.05fr_1fr] lg:py-28">
        <div className="animate-fade-up">
          {hero.badge && (
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-blush/40" />
              <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-blush/80">
                {hero.badge}
              </span>
            </div>
          )}
          <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.01em] sm:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>
          {hero.subtext && (
            <p className="mt-6 max-w-md text-lg leading-relaxed text-blush/75">
              {hero.subtext}
            </p>
          )}
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            {hero.ctaPrimaryLabel && (
              <Link
                href={hero.ctaPrimaryHref || "/catalog"}
                className="group inline-flex items-center gap-2 bg-blush px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-ink shadow-soft transition hover:bg-white"
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
                className="link-underline text-sm font-medium uppercase tracking-[0.08em] text-blush/90 hover:text-blush"
              >
                {hero.ctaSecondaryLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Side stack: admin images, or a decorative placeholder */}
        {sides.length > 0 ? (
          <div className="relative hidden h-[26rem] lg:block">
            {sides.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt=""
                className={`absolute h-80 w-60 object-cover shadow-2xl ring-1 ring-white/10 ${slots[i]}`}
              />
            ))}
          </div>
        ) : (
          <div className="relative hidden h-[26rem] lg:block">
            <div className="absolute right-4 top-0 h-80 w-60 rotate-2 bg-blush/95 shadow-2xl" />
            <div className="absolute right-28 top-12 h-80 w-60 -rotate-3 bg-[#E9B872]/90 shadow-2xl" />
            <div className="absolute right-14 top-4 flex h-80 w-60 flex-col justify-end bg-white p-6 shadow-2xl">
              <div className="h-36 bg-gradient-to-br from-primary-50 to-accent-50" />
              <div className="mt-5 h-3 w-2/3 bg-ink/10" />
              <div className="mt-2 h-3 w-1/3 bg-ink/10" />
              <div className="mt-5 h-10 bg-accent" />
            </div>
          </div>
        )}
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-blush/50 lg:flex">
        <span className="text-[10px] font-semibold uppercase tracking-eyebrow">
          Scroll
        </span>
        <span className="h-8 w-px animate-pulse bg-blush/40" />
      </div>
    </section>
  );
}
