import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/features/catalog/product-gallery";
import { ShareButton } from "@/features/catalog/share-button";
import { VariantSelector } from "@/features/catalog/variant-selector";
import { getProductByHandle } from "@/lib/catalog";
import { selectedCurrency } from "@/lib/currency";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandle(params.handle);
  return { title: product ? product.title : "Product" };
}

// Public product / share page: resolvable by slug OR short_id, no auth required.
export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandle(params.handle, selectedCurrency());
  if (!product) notFound();

  return (
    <div className="container-site py-8 sm:py-12">
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
              {product.brand && (
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">
                  {product.brand.name}
                </p>
              )}
              <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                {product.title}
              </h1>
            </div>
            <ShareButton sharePath={product.share_path} />
          </div>

          {product.description && (
            <p className="mt-5 max-w-prose leading-relaxed text-ink/65">
              {product.description}
            </p>
          )}

          <div className="mt-8 border-t border-ink/10 pt-8">
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
    </div>
  );
}
