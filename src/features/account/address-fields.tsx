"use client";

import { Input } from "@/components/ui/input";
import type { AddressInput } from "@/types/address";

export type AddressDraft = Required<Omit<AddressInput, "is_default">>;

export const EMPTY_ADDRESS: AddressDraft = {
  label: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postal_code: "",
  country: "",
  phone: "",
};

const FIELDS: {
  key: keyof AddressDraft;
  label: string;
  full?: boolean;
  placeholder?: string;
}[] = [
  { key: "label", label: "Label (optional)", placeholder: "Home, Office…" },
  { key: "name", label: "Full name" },
  { key: "line1", label: "Address line 1", full: true },
  { key: "line2", label: "Address line 2 (optional)", full: true },
  { key: "city", label: "City" },
  { key: "region", label: "State / Region (optional)" },
  { key: "postal_code", label: "Postal code (optional)" },
  { key: "country", label: "Country (2-letter)", placeholder: "US" },
  { key: "phone", label: "Phone (optional)", full: true },
];

/** Controlled address fields shared by the account address book and checkout. */
export function AddressFields({
  value,
  onChange,
}: {
  value: AddressDraft;
  onChange: (next: AddressDraft) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {FIELDS.map((f) => (
        <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            {f.label}
          </label>
          <Input
            value={value[f.key] ?? ""}
            placeholder={f.placeholder}
            maxLength={f.key === "country" ? 2 : undefined}
            onChange={(e) => onChange({ ...value, [f.key]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

/** True when the required fields are filled in. */
export function isAddressComplete(a: AddressDraft): boolean {
  return Boolean(a.name && a.line1 && a.city && a.country);
}
