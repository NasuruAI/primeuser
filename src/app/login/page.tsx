import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/features/auth/login-form";
import { getStoreConfig } from "@/lib/config";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const { name } = await getStoreConfig();
  return (
    <div className="container-site flex min-h-[72vh] items-center justify-center py-14">
      <div className="w-full max-w-md border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <span className="eyebrow">Account</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-ink/55">
          Sign in to your {name} account.
        </p>
        <div className="mt-7">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-7 border-t border-ink/10 pt-6 text-center text-sm text-ink/60">
          No account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-accent"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
