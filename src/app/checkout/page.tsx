import { CheckoutForm } from "@/features/checkout/checkout-form";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-site max-w-5xl py-10 sm:py-14">
      <span className="eyebrow">Almost there</span>
      <h1 className="mb-8 mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
        Checkout
      </h1>
      <CheckoutForm />
    </div>
  );
}
