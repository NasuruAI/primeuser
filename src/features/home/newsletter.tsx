"use client";

import { useState } from "react";

export function Newsletter({ storeName }: { storeName: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <div className="grid items-center gap-8 bg-ink px-6 py-14 text-canvas sm:px-12 lg:grid-cols-2 lg:py-16">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">
          Stay in the loop
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
          New drops, early access &amp; private offers.
        </h2>
        <p className="mt-3 max-w-md text-sm text-canvas/60">
          Join the {storeName} list. No spam — just the good stuff, now and then.
        </p>
      </div>

      {done ? (
        <p className="text-lg font-medium text-canvas lg:text-right">
          You&apos;re on the list — welcome. ✶
        </p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-md gap-0 lg:ml-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-12 w-full border border-canvas/25 bg-transparent px-4 text-sm text-canvas placeholder:text-canvas/40 focus:border-canvas focus:outline-none"
          />
          <button
            type="submit"
            className="h-12 shrink-0 bg-accent px-6 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent-hover"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
