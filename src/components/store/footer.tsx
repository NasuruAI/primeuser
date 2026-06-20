import Link from "next/link";

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
          <div className="mt-5 flex gap-3">
            {["Instagram", "TikTok", "X"].map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                className="inline-flex h-9 items-center border border-canvas/20 px-3 text-xs font-medium text-canvas/70 transition hover:border-canvas hover:text-canvas"
              >
                {s}
              </a>
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
