import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import "./globals.css";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteChrome } from "@/components/store/site-chrome";
import { ToastProvider } from "@/components/ui/toast";
import { FavouritesProvider } from "@/features/favourites/favourites-context";
import { getStoreConfig } from "@/lib/config";
import { brandStyle } from "@/lib/theme";
import {
  DEFAULT_KEYWORDS,
  SITE_LOCATION,
  SITE_URL,
  defaultDescription,
  organizationLd,
  webSiteLd,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { name, tagline, logoUrl } = await getStoreConfig();
  const description = defaultDescription(name, tagline);
  const title = `${name} — Clothing Store & Supplier in ${SITE_LOCATION}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${name}` },
    description,
    keywords: DEFAULT_KEYWORDS,
    applicationName: name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: name,
      title,
      description,
      url: SITE_URL,
      locale: "en_NG",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    icons: logoUrl ? { icon: logoUrl } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { name, tagline, logoUrl, supportEmail, phone, brand } =
    await getStoreConfig();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      style={brandStyle(brand.primary, brand.accent)}
    >
      <body className="min-h-screen font-sans">
        {/* Warm up the image CDN connection early for a faster LCP image. */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <JsonLd
          data={organizationLd({
            name,
            tagline,
            logoUrl,
            email: supportEmail,
            phone,
          })}
        />
        <JsonLd data={webSiteLd(name)} />
        <ToastProvider>
          <FavouritesProvider>
            <SiteChrome>{children}</SiteChrome>
          </FavouritesProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
