"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A–Z" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("sort") ?? "newest";

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "newest") next.delete("sort");
    else next.set("sort", value);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-ink/55">
      <span className="hidden sm:inline">Sort</span>
      <select
        aria-label="Sort products"
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 cursor-pointer rounded-md bg-blush px-3 text-sm text-ink transition-colors hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
