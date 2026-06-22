"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Currency = { code: string; symbol: string };

function readCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")[1];
}

/** Header currency selector — persists the choice and refreshes server prices. */
export function CurrencyMenu() {
  const router = useRouter();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    fetch("/api/proxy/currency/")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setCurrencies(d.currencies ?? []);
        setValue(readCookie("ic_currency") ?? d.base ?? "USD");
      })
      .catch(() => {});
  }, []);

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value;
    setValue(code);
    await fetch("/api/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    // Re-fetch the client cart (drawer + cart page) in the new currency.
    window.dispatchEvent(new Event("ic:cart-refresh"));
    router.refresh();
  }

  if (currencies.length === 0) return null;

  return (
    <select
      aria-label="Currency"
      value={value}
      onChange={onChange}
      className="h-9 cursor-pointer rounded-full bg-blush px-3 text-sm text-ink transition-colors hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      {currencies.map((c) => (
        <option key={c.code} value={c.code}>
          {c.code} {c.symbol}
        </option>
      ))}
    </select>
  );
}
