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
    <div className="container-site py-10">
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/catalog" className="hover:text-primary">
          Shop
        </Link>{" "}
        / <span className="text-ink/70">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* Gallery — stays in view while the details scroll on desktop */}
        <div className="lg:sticky lg:top-24">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Details */}
        <div className="lg:py-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              {product.brand && (
                <p className="text-sm font-medium uppercase tracking-wide text-primary">
                  {product.brand.name}
                </p>
              )}
              <h1 className="mt-1 font-display text-4xl font-bold text-ink">
                {product.title}
              </h1>
            </div>
            <ShareButton sharePath={product.share_path} />
          </div>

          {product.description && (
            <p className="mt-5 leading-relaxed text-ink/70">
              {product.description}
            </p>
          )}

          <div className="mt-7 border-t border-ink/10 pt-7">
            <VariantSelector product={product} />
          </div>

          <ul className="mt-8 space-y-2 text-sm text-ink/60">
            <li className="flex items-center gap-2">
              ✓ Free shipping over $50
            </li>
            <li className="flex items-center gap-2">✓ 30-day returns</li>
            <li className="flex items-center gap-2">
              ✓ Priced in your currency
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
