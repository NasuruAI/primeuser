"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { addressApi } from "@/lib/address-client";
import type { Address } from "@/types/address";

import {
  AddressDraft,
  AddressFields,
  EMPTY_ADDRESS,
  isAddressComplete,
} from "./address-fields";

function toDraft(a: Address): AddressDraft {
  return {
    label: a.label,
    name: a.name,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    region: a.region,
    postal_code: a.postal_code,
    country: a.country,
    phone: a.phone,
  };
}

function summarise(a: Address): string {
  return [a.line1, a.line2, a.city, a.region, a.postal_code, a.country]
    .filter(Boolean)
    .join(", ");
}

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<AddressDraft>(EMPTY_ADDRESS);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function load() {
    setAddresses(await addressApi.list());
  }
  useEffect(() => {
    load();
  }, []);

  function startAdd() {
    setDraft(EMPTY_ADDRESS);
    setEditingId("new");
  }
  function startEdit(a: Address) {
    setDraft(toDraft(a));
    setEditingId(a.id);
  }

  async function save() {
    if (!isAddressComplete(draft)) {
      toast.error("Please fill in name, address, city and country.");
      return;
    }
    setBusy(true);
    try {
      if (editingId === "new") await addressApi.create(draft);
      else if (editingId) await addressApi.update(editingId, draft);
      setEditingId(null);
      await load();
      toast.success("Address saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save address.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this address?")) return;
    try {
      await addressApi.remove(id);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete.");
    }
  }

  async function makeDefault(id: string) {
    try {
      await addressApi.setDefault(id);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not set default.");
    }
  }

  if (addresses === null) {
    return <p className="text-sm text-ink/50">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.length === 0 && editingId === null && (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center text-sm text-ink/55">
          You have no saved addresses yet.
        </div>
      )}

      {addresses.map((a) =>
        editingId === a.id ? (
          <EditCard
            key={a.id}
            draft={draft}
            setDraft={setDraft}
            busy={busy}
            onSave={save}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div
            key={a.id}
            className="flex items-start justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-5"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">{a.name}</span>
                {a.label && (
                  <span className="bg-surface px-2 py-0.5 text-[11px] text-ink/60">
                    {a.label}
                  </span>
                )}
                {a.is_default && (
                  <span className="bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink/60">{summarise(a)}</p>
              {a.phone && (
                <p className="mt-0.5 text-sm text-ink/45">{a.phone}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5 text-sm">
              <button
                type="button"
                onClick={() => startEdit(a)}
                className="font-medium text-primary hover:text-accent"
              >
                Edit
              </button>
              {!a.is_default && (
                <button
                  type="button"
                  onClick={() => makeDefault(a.id)}
                  className="text-ink/55 hover:text-primary"
                >
                  Set default
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(a.id)}
                className="text-ink/40 hover:text-accent"
              >
                Delete
              </button>
            </div>
          </div>
        ),
      )}

      {editingId === "new" ? (
        <EditCard
          draft={draft}
          setDraft={setDraft}
          busy={busy}
          onSave={save}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        editingId === null && (
          <div>
            <Button type="button" onClick={startAdd}>
              + Add a new address
            </Button>
          </div>
        )
      )}
    </div>
  );
}

function EditCard({
  draft,
  setDraft,
  busy,
  onSave,
  onCancel,
}: {
  draft: AddressDraft;
  setDraft: (d: AddressDraft) => void;
  busy: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <AddressFields value={draft} onChange={setDraft} />
      <div className="mt-4 flex gap-2">
        <Button type="button" onClick={onSave} disabled={busy}>
          {busy ? "Saving…" : "Save address"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
