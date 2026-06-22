"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SelectMenu } from "@/components/ui/select-menu";

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

  async function onChange(code: string) {
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
    <SelectMenu
      ariaLabel="Currency"
      value={value}
      onChange={onChange}
      pill
      options={currencies.map((c) => ({
        value: c.code,
        label: `${c.code} ${c.symbol}`,
      }))}
    />
  );
}
