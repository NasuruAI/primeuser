import Link from "next/link";
import { redirect } from "next/navigation";

import { ChangePasswordForm } from "@/features/account/change-password-form";
import { ProfileForm } from "@/features/account/profile-form";
import { getSession } from "@/lib/session";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="eyebrow">Account</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          Overview
        </h1>
      </div>

      {/* Account details */}
      <section className="border border-ink/10 bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">
          Account details
        </h2>
        <dl className="grid grid-cols-[7rem_1fr] gap-y-3 text-sm">
          <dt className="text-ink/50">Email</dt>
          <dd className="flex flex-wrap items-center gap-2 text-ink">
            {user.email}
            {user.profile.email_verified ? (
              <span className="bg-green-100 px-2 py-0.5 text-xs text-green-700">
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <span className="bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                  Not verified
                </span>
                <Link
                  href="/account/settings"
                  className="text-xs font-medium text-primary hover:text-accent"
                >
                  Verify →
                </Link>
              </span>
            )}
          </dd>
          <dt className="text-ink/50">Role</dt>
          <dd className="capitalize text-ink">{user.role}</dd>
          <dt className="text-ink/50">Member since</dt>
          <dd className="text-ink">
            {new Date(user.date_joined).toLocaleDateString()}
          </dd>
        </dl>
      </section>

      {/* Editable profile */}
      <section className="border border-ink/10 bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">Profile</h2>
        <ProfileForm user={user} />
      </section>

      {/* Security */}
      <section className="border border-ink/10 bg-white p-6">
        <h2 className="mb-1 font-display text-lg font-bold text-ink">Password</h2>
        <p className="mb-4 text-sm text-ink/55">
          Use a strong password you don&apos;t reuse elsewhere.
        </p>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
