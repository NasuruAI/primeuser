"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Status = { number: string; status: string; paid: boolean };

const PAID_STATES = new Set([
  "paid",
  "routing",
  "partially_fulfilled",
  "fulfilled",
  "completed",
]);
const FAILED_STATES = new Set(["cancelled", "refunded"]);

/**
 * Post-payment landing page. The shopper returns here from the gateway while the
 * provider's webhook marks the order paid asynchronously — so we poll the public
 * order-status endpoint until it settles.
 */
export function PaymentProcessing({ orderNumber }: { orderNumber: string }) {
  const [phase, setPhase] = useState<"pending" | "paid" | "failed" | "timeout">(
    "pending",
  );
  const cancelled = useRef(false);

  useEffect(() => {
    if (!orderNumber) {
      setPhase("timeout");
      return;
    }
    cancelled.current = false;
    let attempts = 0;
    const MAX = 20; // ~60s at 3s intervals

    async function poll() {
      if (cancelled.current) return;
      attempts += 1;
      try {
        const res = await fetch(`/api/proxy/orders/${orderNumber}/status/`, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = (await res.json()) as Status;
          if (data.paid || PAID_STATES.has(data.status)) {
            setPhase("paid");
            window.dispatchEvent(new Event("ic:cart-refresh"));
            return;
          }
          if (FAILED_STATES.has(data.status)) {
            setPhase("failed");
            return;
          }
        }
      } catch {
        /* transient — keep polling */
      }
      if (attempts >= MAX) {
        setPhase("timeout");
        return;
      }
      setTimeout(poll, 3000);
    }

    void poll();
    return () => {
      cancelled.current = true;
    };
  }, [orderNumber]);

  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      {phase === "pending" && (
        <>
          <Spinner />
          <h1 className="mt-6 font-display text-2xl font-bold text-ink">
            Finalising your payment…
          </h1>
          <p className="mt-2 max-w-md text-ink/55">
            We&apos;re confirming your transaction with the payment provider.
            This usually takes a few seconds — please don&apos;t close this page.
          </p>
        </>
      )}

      {phase === "paid" && (
        <>
          <CheckMark />
          <h1 className="mt-6 font-display text-3xl font-bold text-ink">
            Payment confirmed
          </h1>
          <p className="mt-2 text-ink/60">
            Thank you! Your order{" "}
            <span className="font-medium text-ink">{orderNumber}</span> is paid.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/account/orders"
              className="inline-flex h-11 items-center bg-ink px-7 text-xs font-semibold uppercase tracking-[0.08em] text-canvas transition hover:bg-primary"
            >
              View your orders
            </Link>
            <Link
              href="/catalog"
              className="inline-flex h-11 items-center border border-ink/15 bg-white px-7 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition hover:border-ink"
            >
              Keep shopping
            </Link>
          </div>
        </>
      )}

      {phase === "failed" && (
        <>
          <h1 className="font-display text-2xl font-bold text-ink">
            Payment not completed
          </h1>
          <p className="mt-2 max-w-md text-ink/55">
            Your order <span className="font-medium">{orderNumber}</span>{" "}
            wasn&apos;t paid. If you were charged, it will be reversed.
          </p>
          <Link
            href="/cart"
            className="mt-7 inline-flex h-11 items-center bg-ink px-7 text-xs font-semibold uppercase tracking-[0.08em] text-canvas transition hover:bg-primary"
          >
            Back to bag
          </Link>
        </>
      )}

      {phase === "timeout" && (
        <>
          <h1 className="font-display text-2xl font-bold text-ink">
            Still processing
          </h1>
          <p className="mt-2 max-w-md text-ink/55">
            Your payment is taking a little longer to confirm. We&apos;ll email
            you once it&apos;s done — you can also check{" "}
            <Link href="/account/orders" className="text-primary underline">
              your orders
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin text-primary"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckMark() {
  return (
    <span className="flex h-14 w-14 items-center justify-center bg-green-100">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 13l4 4L19 7"
          stroke="#16a34a"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
