import Link from "next/link";

import type { SocialLink } from "@/lib/config";

import { SocialIcon } from "./social-icons";

const PAYMENTS = ["Visa", "Mastercard", "Verve", "Paystack", "Bank Transfer"];

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/catalog", label: "All products" },
      { href: "/catalog?sort=newest", label: "New in" },
      { href: "/blog", label: "Journal" },
      { href: "/cart", label: "Your bag" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "Your account" },
      { href: "/account/orders", label: "Orders" },
      { href: "/account/addresses", label: "Addresses" },
      { href: "/account/settings", label: "Notifications" },
    ],
  },
];

export function Footer({
  storeName,
  tagline,
  supportEmail,
  socialLinks,
}: {
  storeName: string;
  tagline: string;
  supportEmail: string;
  socialLinks: SocialLink[];
}) {
  return (
    <footer className="mt-24 bg-ink text-canvas">
      {/* Brand line */}
      <div className="container-site border-b border-canvas/10 py-12">
        <div className="font-display text-4xl font-bold sm:text-5xl">
          {storeName}
        </div>
        <p className="mt-3 max-w-sm text-sm text-canvas/55">{tagline}</p>
      </div>

      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-canvas/45">
              {col.title}
            </h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-canvas/70 transition hover:text-canvas"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-canvas/45">
            Help
          </h3>
          <ul className="mt-5 space-y-3">
            <li>
              <a
                href={`mailto:${supportEmail}`}
                className="text-sm text-canvas/70 transition hover:text-canvas"
              >
                Contact support
              </a>
            </li>
            <li className="text-sm text-canvas/45">{supportEmail}</li>
          </ul>
        </div>

        {socialLinks.length > 0 && (
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-canvas/45">
              Follow
            </h3>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {socialLinks.map((s, i) => (
                <a
                  key={`${s.name}-${i}`}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-canvas/20 text-canvas/70 transition hover:border-canvas hover:bg-canvas hover:text-ink"
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment methods */}
      <div className="border-t border-canvas/10">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-canvas/45">
            We accept
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="inline-flex h-8 items-center rounded bg-canvas px-3 text-xs font-semibold text-ink"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-canvas/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-canvas/45 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 bg-green-400" />
            Secure encrypted checkout
          </span>
        </div>
      </div>
    </footer>
  );
}
