import Link from "next/link";
import type { ReactNode } from "react";

type IconProps = { className?: string };

const Icon = (path: ReactNode) =>
  function SocialSvg({ className }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width="18"
        height="18"
        aria-hidden
        className={className}
      >
        {path}
      </svg>
    );
  };

const YouTube = Icon(
  <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12z" />,
);
const TikTok = Icon(
  <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v12.93a2.5 2.5 0 1 1-2.5-2.5c.2 0 .4.03.59.08v-3.4a5.9 5.9 0 1 0 5.21 5.86V8.66a7.5 7.5 0 0 0 4.36 1.4V6.74a4.28 4.28 0 0 1-3.3-.92z" />,
);
const Pinterest = Icon(
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.43 7.63 11.18-.1-.95-.2-2.4.04-3.44.22-.93 1.4-5.95 1.4-5.95s-.36-.72-.36-1.78c0-1.66.97-2.9 2.17-2.9 1.02 0 1.51.77 1.51 1.69 0 1.03-.65 2.57-1 4-.28 1.2.6 2.17 1.78 2.17 2.13 0 3.77-2.25 3.77-5.5 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.2 0 1.03.4 2.13.89 2.73.1.12.11.22.08.34l-.33 1.37c-.05.22-.18.27-.4.16-1.5-.7-2.43-2.88-2.43-4.64 0-3.78 2.75-7.25 7.92-7.25 4.16 0 7.39 2.96 7.39 6.92 0 4.13-2.6 7.46-6.22 7.46-1.21 0-2.35-.63-2.74-1.38l-.75 2.84c-.27 1.04-1 2.35-1.49 3.15A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />,
);
const Instagram = Icon(
  <>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0z" />
    <path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
    <circle cx="18.41" cy="5.59" r="1.44" />
  </>,
);
const Facebook = Icon(
  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />,
);

const SOCIALS = [
  { name: "YouTube", href: "https://youtube.com", Icon: YouTube },
  { name: "TikTok", href: "https://tiktok.com", Icon: TikTok },
  { name: "Pinterest", href: "https://pinterest.com", Icon: Pinterest },
  { name: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { name: "Facebook", href: "https://facebook.com", Icon: Facebook },
];

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
}: {
  storeName: string;
  tagline: string;
  supportEmail: string;
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

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-canvas/45">
            Follow
          </h3>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {SOCIALS.map(({ name, href, Icon: SocialIcon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-canvas/20 text-canvas/70 transition hover:border-canvas hover:bg-canvas hover:text-ink"
              >
                <SocialIcon />
              </a>
            ))}
          </div>
        </div>
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
