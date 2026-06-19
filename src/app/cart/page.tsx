import { CartView } from "@/features/cart/cart-view";

export const metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <div className="container-site py-10 sm:py-14">
      <span className="eyebrow">Your bag</span>
      <h1 className="mb-8 mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
        Shopping bag
      </h1>
      <CartView />
    </div>
  );
}
