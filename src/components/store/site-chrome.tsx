import { CartProvider } from "@/features/cart/cart-context";
import { CartDrawer } from "@/features/cart/cart-drawer";
import { getStoreConfig } from "@/lib/config";

import { Footer } from "./footer";
import { Header } from "./header";

/** Storefront header/footer wrapper. (Admin is a separate application.) */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const config = await getStoreConfig();

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header
          storeName={config.name}
          logoUrl={config.logoUrl}
          announcement={config.announcement}
        />
        <main className="flex-1">{children}</main>
        <Footer
          storeName={config.name}
          tagline={config.tagline}
          supportEmail={config.supportEmail}
          socialLinks={config.socialLinks}
        />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
