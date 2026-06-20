/**
 * Long-form SEO content for the storefront home page. Targets queries like
 * "best clothing supplier in Lagos Nigeria" and "wholesale clothing Nigeria".
 * Kept lightweight (muted, readable) and placed just above the footer.
 */
export function SeoContent({ storeName }: { storeName: string }) {
  return (
    <section className="border-t border-ink/10 bg-canvas">
      <div className="container-site py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10 text-sm leading-relaxed text-ink/65">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              {storeName} — No. 1 Suppliers of Clothing in Nigeria
            </h2>
            <p className="mt-4">
              {storeName} is one of Nigeria&apos;s leading clothing suppliers,
              giving customers and resellers a single online store to find and
              shop for quality fashion at the best prices. From the comfort of
              your home or during a work break, you can browse our full
              collection and have everything delivered fast across Lagos and
              nationwide — without stress or moving an inch. Whether you need
              everyday outfits, statement pieces, or bulk stock for your
              business, you can get it all in one place at {storeName}.
            </p>
            <p className="mt-4">
              Beyond retail, {storeName} is built for wholesale. With
              minimum-order quantities and quantity price breaks on many
              products, boutique owners, market traders, and online vendors can
              buy more and save more — turning {storeName} into a reliable
              supply partner for their growing fashion business.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              Shop Original, Quality Clothing at the Best Prices
            </h2>
            <p className="mt-4">
              {storeName} prides itself on offering the best prices and the best
              quality of clothing you can find anywhere in the country. Every
              item is carefully sourced so that customers are assured of original,
              durable pieces — at retail and at wholesale. Enjoy regular offers
              and heavy discounts on flash sales spanning dresses, tops, denim,
              footwear, and accessories, and be among the first to shop new
              arrivals as soon as they drop.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              The Latest Fashion and Trendy Outfits Online
            </h2>
            <p className="mt-4">
              Discover an extensive range of fashion for women, men, and kids.
              Our women&apos;s collection includes blouses, tops, trousers, jeans
              and gowns in different lengths and materials to suit your style,
              alongside accessories like shoes, bags, jewelry, and sunglasses at
              unbeatable prices.
            </p>
            <p className="mt-4">
              For men, {storeName} carries stylish, quality pieces — trousers,
              shirts, shoes, watches and more — at the most affordable prices,
              plus trendy sneakers and sportswear for the active. And we
              haven&apos;t forgotten the little ones: browse our selection of
              children&apos;s clothing for boys and girls. Shop now on{" "}
              {storeName} and enjoy an incredible online shopping experience with
              fast delivery, easy returns, and flexible payment options.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
