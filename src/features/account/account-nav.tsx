"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useFavourites } from "@/features/favourites/favourites-context";

const ITEMS = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/favourites", label: "Favourites", showCount: true },
  { href: "/account/settings", label: "Notifications" },
];

export function AccountNav() {
  const pathname = usePathname();
  const { count } = useFavourites();

  return (
    <nav className="flex flex-col">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between border-l-2 px-3 py-2 text-sm transition ${
              active
                ? "border-accent bg-white font-medium text-primary"
                : "border-transparent text-ink/70 hover:text-primary"
            }`}
          >
            <span>{item.label}</span>
            {item.showCount && count > 0 && (
              <span className="bg-accent px-1.5 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
