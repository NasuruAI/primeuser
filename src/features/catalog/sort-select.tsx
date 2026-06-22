"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SelectMenu } from "@/components/ui/select-menu";

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
    <div className="flex items-center gap-2 text-sm text-ink/55">
      <span className="hidden sm:inline">Sort</span>
      <SelectMenu
        ariaLabel="Sort products"
        value={current}
        onChange={onChange}
        options={OPTIONS}
      />
    </div>
  );
}
