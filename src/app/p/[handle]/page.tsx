import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { Stars } from "@/components/ui/stars";
import { FlashBadge, StockBar } from "@/components/ui/stock-bar";
import { ProductGallery } from "@/features/catalog/product-gallery";
import { ProductTabs } from "@/features/catalog/product-tabs";
import { ShareButton } from "@/features/catalog/share-button";
import { VariantSelector } from "@/features/catalog/variant-selector";
import { getProductByHandle, getReviews } from "@/lib/catalog";
import { selectedCurrency } from "@/lib/currency";
import {
  SITE_LOCATION,
  absoluteUrl,
  breadcrumbLd,
  productLd,
} from "@/lib/seo";
import type { ProductDetail } from "@/types/catalog";

function priceFrom(product: ProductDetail): string | null {
  const prices = product.variants
    .map((v) => Number(v.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  return prices.length ? String(Math.min(...prices)) : null;
}

function seoDescription(product: ProductDetail): string {
  const base = product.description?.trim();
  const brand = product.brand ? `${product.brand.name} ` : "";
  return (
    (base && base.length > 40
      ? base
      : `Shop ${brand}${product.title} at the best clothing store in ${SITE_LOCATION}.`) +
    ` Fast delivery across Lagos & nationwide.`
  ).slice(0, 300);
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);
  if (!product) return { title: "Product not found" };
  const description = seoDescription(product);
  const image = product.images[0]?.urls.detail;
  const url = `/p/${product.slug}`;
  return {
    title: `${product.title}${product.brand ? ` — ${product.brand.name}` : ""}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: product.title,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

// Public product / share page: resolvable by slug OR short_id, no auth required.
export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandle(params.handle, selectedCurrency());
  if (!product) notFound();

  const reviews = await getReviews(product.slug);
  const url = absoluteUrl(`/p/${product.slug}`);
  const inStock = product.variants.some((v) => v.in_stock);

  return (
    <div className="container-site py-8 sm:py-12">
      <JsonLd
        data={productLd({
          name: product.title,
          description: seoDescription(product),
          url,
          image: product.images[0]?.urls.detail,
          brand: product.brand?.name,
          sku: product.variants.find((v) => v.is_default)?.sku,
          price: priceFrom(product),
          currency: "NGN",
          inStock,
          ratingValue: Number(product.rating_avg),
          ratingCount: product.rating_count,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "/" },
          { name: "Shop", url: "/catalog" },
          { name: product.title, url: `/p/${product.slug}` },
        ])}
      />
      <nav className="mb-7 text-xs uppercase tracking-[0.12em] text-ink/40">
        <Link href="/" className="transition hover:text-primary">
          Home
        </Link>
        <span className="px-2">/</span>
        <Link href="/catalog" className="transition hover:text-primary">
          Shop
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink/70">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-14">
        {/* Gallery — stays in view while the details scroll on desktop */}
        <div className="lg:sticky lg:top-24">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Details */}
        <div className="lg:py-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {product.is_flash_sale && <FlashBadge />}
                {product.brand && (
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">
                    {product.brand.name}
                  </p>
                )}
              </div>
              <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                {product.title}
              </h1>
              {product.rating_count > 0 && (
                <a
                  href="#reviews"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-ink/60 transition hover:text-ink"
                >
                  <Stars rating={Number(product.rating_avg)} size={15} />
                  {Number(product.rating_avg).toFixed(1)} ({product.rating_count}{" "}
                  review{product.rating_count === 1 ? "" : "s"})
                </a>
              )}
            </div>
            <ShareButton sharePath={product.share_path} />
          </div>

          {product.stock_full > 0 && (
            <StockBar
              available={product.stock_available}
              full={product.stock_full}
              className="mt-6 max-w-xs"
            />
          )}

          <div className="mt-7 border-t border-ink/10 pt-7">
            <VariantSelector product={product} />
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-3 border-t border-ink/10 pt-8 text-sm text-ink/65 sm:grid-cols-3">
            {[
              { t: "Free shipping", d: "On qualifying orders" },
              { t: "Easy returns", d: "Within 30 days" },
              { t: "Your currency", d: "Live FX at checkout" },
            ].map((f) => (
              <li key={f.t}>
                <span className="block font-medium text-ink">{f.t}</span>
                <span className="text-xs text-ink/45">{f.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Description · Features · Reviews */}
      <div id="reviews" className="scroll-mt-24">
        <ProductTabs product={product} reviews={reviews} />
      </div>
    </div>
  );
}
