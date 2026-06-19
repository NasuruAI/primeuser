import Link from "next/link";

import { RegisterForm } from "@/features/auth/register-form";
import { getStoreConfig } from "@/lib/config";

export const metadata = { title: "Create account" };

export default async function RegisterPage() {
  const { name } = await getStoreConfig();
  return (
    <div className="container-site flex min-h-[72vh] items-center justify-center py-14">
      <div className="w-full max-w-md border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <span className="eyebrow">Join us</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-ink/55">Start shopping with {name}.</p>
        <div className="mt-7">
          <RegisterForm />
        </div>
        <p className="mt-7 border-t border-ink/10 pt-6 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-accent"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
