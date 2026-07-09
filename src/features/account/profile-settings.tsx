"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { parseApiError } from "@/lib/api-error";
import type { User } from "@/types/auth";

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw await parseApiError(res);
  return (await res.json()) as T;
}

export function ProfileSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyTelegram, setNotifyTelegram] = useState(false);
  const [chatId, setChatId] = useState("");
  const [botToken, setBotToken] = useState("");
  const toast = useToast();

  async function load() {
    const me = await api<User>("/auth/me/");
    setUser(me);
    setNotifyEmail(me.profile.notify_email);
    setNotifyTelegram(me.profile.notify_telegram);
    setChatId(me.profile.telegram_chat_id);
    setBotToken(""); // never returned; left blank unless changing
  }

  useEffect(() => {
    load().catch((e) =>
      toast.error(e instanceof Error ? e.message : "Failed to load settings."),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    const body: Record<string, unknown> = {
      notify_email: notifyEmail,
      notify_telegram: notifyTelegram,
      telegram_chat_id: chatId,
    };
    if (botToken.trim()) body.telegram_bot_token = botToken.trim();
    try {
      await api("/auth/me/", { method: "PATCH", body: JSON.stringify(body) });
      await load();
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    }
  }

  async function sendVerification() {
    try {
      await api("/auth/verify-email/", { method: "POST", body: "{}" });
      toast.success("Verification email sent — check your inbox");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not send verification email.",
      );
    }
  }

  if (!user) return <p className="text-ink/55">Loading…</p>;

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border border-ink/10 p-5">
        <h2 className="mb-3 font-medium">Email</h2>
        <div className="flex items-center gap-3 text-sm">
          <span>{user.email}</span>
          {user.profile.email_verified ? (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
              Verified
            </span>
          ) : (
            <>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                Not verified
              </span>
              <Button type="button" variant="ghost" onClick={sendVerification}>
                Send verification email
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 p-5">
        <h2 className="mb-3 font-medium">Notifications</h2>
        <p className="mb-4 text-sm text-ink/55">
          Choose how you want order and shipping updates — email, Telegram,
          both, or neither.
        </p>
        <label className="mb-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.checked)}
          />
          Email notifications
        </label>
        <label className="mb-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={notifyTelegram}
            onChange={(e) => setNotifyTelegram(e.target.checked)}
          />
          Telegram notifications
        </label>

        {notifyTelegram && (
          <div className="flex flex-col gap-3 rounded-md bg-blush p-4">
            <p className="text-xs text-ink/55">
              Create a bot with @BotFather, then enter your bot token and your
              chat id. Your token is stored securely and never shown again.
              {user.profile.telegram_connected &&
                " (Telegram is currently connected.)"}
            </p>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Telegram chat id
              </label>
              <Input
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Bot token{" "}
                {user.profile.telegram_connected && (
                  <span className="text-xs text-ink/40">
                    (leave blank to keep current)
                  </span>
                )}
              </label>
              <Input
                type="password"
                placeholder="123456:ABC-..."
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
              />
            </div>
          </div>
        )}
      </section>

      <div className="flex items-center gap-4">
        <Button type="button" onClick={save}>
          Save settings
        </Button>
      </div>
    </div>
  );
}
