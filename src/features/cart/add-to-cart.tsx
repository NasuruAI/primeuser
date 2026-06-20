"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cartApi } from "@/lib/cart-client";

import { useCart } from "./cart-context";

export function AddToCart({
  variantId,
  quantity = 1,
  disabled,
}: {
  variantId: string | null;
  quantity?: number;
  disabled?: boolean;
}) {
  const { run, openCart } = useCart();
  const toast = useToast();
  const [state, setState] = useState<"idle" | "adding">("idle");

  async function onAdd() {
    if (!variantId) return;
    setState("adding");
    try {
      await run(() => cartApi.addItem(variantId, Math.max(1, quantity)));
      toast.success("Added to bag");
      openCart();
    } catch {
      // Error already surfaced as a toast by the cart context.
    } finally {
      setState("idle");
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={onAdd}
        disabled={disabled || !variantId || state === "adding"}
      >
        {state === "adding" ? "Adding…" : "Add to cart"}
      </Button>
    </div>
  );
}
