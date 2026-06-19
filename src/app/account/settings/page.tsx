import { ProfileSettings } from "@/features/account/profile-settings";

export const metadata = { title: "Notifications" };

export default function AccountSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">Preferences</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          Notifications
        </h1>
      </div>
      <ProfileSettings />
    </div>
  );
}
