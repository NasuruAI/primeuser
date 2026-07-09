"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { parseApiError } from "@/lib/api-error";

type State = "verifying" | "ok" | "error";

export function VerifyEmail() {
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("Missing verification token.");
      return;
    }
    fetch("/api/proxy/auth/verify-email/confirm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          setState("ok");
        } else {
          const err = await parseApiError(res);
          setState("error");
          setMessage(
            err.message || "This verification link is invalid or has expired.",
          );
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  return (
    <div className="text-center">
      {state === "verifying" && (
        <p className="text-ink/55">Verifying your email…</p>
      )}
      {state === "ok" && (
        <>
          <h1 className="text-2xl font-semibold text-green-700">
            Email verified 🎉
          </h1>
          <p className="mt-2 text-ink/70">
            Your email address is now confirmed.
          </p>
          <Link
            href="/account"
            className="mt-4 inline-block font-medium underline"
          >
            Go to your account →
          </Link>
        </>
      )}
      {state === "error" && (
        <>
          <h1 className="text-2xl font-semibold">Verification failed</h1>
          <p className="mt-2 text-ink/70">{message}</p>
          <Link
            href="/account/settings"
            className="mt-4 inline-block font-medium underline"
          >
            Resend from settings →
          </Link>
        </>
      )}
    </div>
  );
}
