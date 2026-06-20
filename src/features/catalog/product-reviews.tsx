"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stars } from "@/components/ui/stars";
import { useToast } from "@/components/ui/toast";
import type { Review } from "@/types/catalog";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ProductReviews({
  productId,
  slug,
  ratingAvg,
  ratingCount,
  initialReviews,
}: {
  productId: string;
  slug: string;
  ratingAvg: number;
  ratingCount: number;
  initialReviews: Review[];
}) {
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [avg, setAvg] = useState(ratingAvg);
  const [count, setCount] = useState(ratingCount);
  const [loggedIn, setLoggedIn] = useState(false);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/proxy/auth/me/")
      .then((r) => setLoggedIn(r.ok))
      .catch(() => setLoggedIn(false));
  }, []);

  async function refresh() {
    try {
      const res = await fetch(`/api/proxy/catalog/products/${slug}/reviews/`);
      const data = await res.json();
      const list: Review[] = data.results ?? data ?? [];
      setReviews(list);
      setCount(list.length);
      setAvg(
        list.length
          ? list.reduce((s, r) => s + r.rating, 0) / list.length
          : 0,
      );
    } catch {
      /* keep current */
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      toast.error("Please pick a star rating.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/proxy/catalog/reviews/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId, rating, title, body }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => null);
        throw new Error(b?.error?.message ?? "Could not submit your review.");
      }
      toast.success("Thanks for your review!");
      setRating(0);
      setTitle("");
      setBody("");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[18rem_1fr]">
      {/* Summary + form */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-bold text-ink">
              {avg ? avg.toFixed(1) : "—"}
            </span>
            <div className="pb-1">
              <Stars rating={avg} size={16} />
              <div className="mt-1 text-xs text-ink/50">
                {count} review{count === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-ink/10 pt-6">
          <h3 className="font-display text-lg font-bold text-ink">
            Write a review
          </h3>
          {loggedIn ? (
            <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
              <div
                className="flex gap-1"
                onMouseLeave={() => setHover(0)}
                role="radiogroup"
                aria-label="Your rating"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i} star${i === 1 ? "" : "s"}`}
                    onMouseEnter={() => setHover(i)}
                    onClick={() => setRating(i)}
                    className="p-0.5"
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill={(hover || rating) >= i ? "#C9184A" : "none"}
                      stroke="#C9184A"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    >
                      <path d="M12 17.3l-6.2 3.7 1.6-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.4 4.8 1.6 7z" />
                    </svg>
                  </button>
                ))}
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="Share your thoughts…"
                className="w-full border border-ink/15 bg-white p-3 text-sm text-ink focus:border-ink focus:outline-none"
              />
              <Button type="submit" disabled={busy} className="self-start">
                {busy ? "Submitting…" : "Submit review"}
              </Button>
            </form>
          ) : (
            <p className="mt-3 text-sm text-ink/60">
              <Link
                href={`/login?next=/p/${slug}`}
                className="font-medium text-primary hover:text-accent"
              >
                Sign in
              </Link>{" "}
              to write a review.
            </p>
          )}
        </div>
      </div>

      {/* List */}
      <div>
        {reviews.length === 0 ? (
          <p className="text-sm text-ink/55">
            No reviews yet — be the first to review this product.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-ink/10">
            {reviews.map((r) => (
              <li key={r.id} className="py-5 first:pt-0">
                <div className="flex items-center gap-3">
                  <Stars rating={r.rating} size={14} />
                  <span className="text-sm font-medium text-ink">
                    {r.author_name}
                  </span>
                  {r.is_verified_purchase && (
                    <span className="bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                      Verified
                    </span>
                  )}
                  <span className="ml-auto text-xs text-ink/40">
                    {fmtDate(r.created_at)}
                  </span>
                </div>
                {r.title && (
                  <h4 className="mt-2 text-sm font-semibold text-ink">
                    {r.title}
                  </h4>
                )}
                {r.body && (
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink/70">
                    {r.body}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
