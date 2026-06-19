import { AddressBook } from "@/features/account/address-book";

export const metadata = { title: "Addresses" };

export default function AddressesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">Shipping</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          Addresses
        </h1>
        <p className="mt-2 text-sm text-ink/55">
          Manage your saved shipping addresses. Your default is selected
          automatically at checkout.
        </p>
      </div>
      <AddressBook />
    </div>
  );
}
