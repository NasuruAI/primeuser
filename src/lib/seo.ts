/**
 * Central SEO config + structured-data (JSON-LD) builders.
 *
 * Targets local intent — a clothing store/supplier in Lagos, Nigeria — via rich
 * metadata, Organization/LocalBusiness + WebSite + Product + Breadcrumb schema.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nasuru.com"
).replace(/\/$/, "");

export const SITE_LOCALITY = "Lagos";
export const SITE_REGION = "Lagos";
export const SITE_COUNTRY = "NG";
export const SITE_LOCATION = "Lagos, Nigeria";

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Keyword-rich default description woven around the target local query. */
export function defaultDescription(name: string, tagline: string): string {
  return `${name} — premium clothing store & supplier in ${SITE_LOCATION}. Shop the latest fashion and quality clothing with fast delivery across Lagos and nationwide.${
    tagline ? ` ${tagline}` : ""
  }`;
}

export const DEFAULT_KEYWORDS = [
  "clothing store Lagos",
  "clothing supplier Lagos",
  "best clothing in Lagos Nigeria",
  "fashion store Lagos Nigeria",
  "buy clothes online Lagos",
  "Nigerian fashion",
  "clothing Nigeria",
];

type Json = Record<string, unknown>;

/** Organization + LocalBusiness identity (served from the homepage). */
export function organizationLd(opts: {
  name: string;
  tagline: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
}): Json {
  const ld: Json = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ClothingStore"],
    "@id": `${SITE_URL}/#organization`,
    name: opts.name,
    url: SITE_URL,
    description: defaultDescription(opts.name, opts.tagline),
    areaServed: [
      { "@type": "City", name: "Lagos" },
      { "@type": "Country", name: "Nigeria" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_LOCALITY,
      addressRegion: SITE_REGION,
      addressCountry: SITE_COUNTRY,
    },
  };
  if (opts.logoUrl) ld.logo = opts.logoUrl;
  if (opts.email) ld.email = opts.email;
  if (opts.phone) ld.telephone = opts.phone;
  return ld;
}

/** WebSite + sitelinks search box. */
export function webSiteLd(name: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/catalog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Product rich result (price, availability, brand, image). */
export function productLd(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  brand?: string;
  sku?: string;
  price?: string | null;
  currency?: string;
  inStock?: boolean;
  ratingValue?: number;
  ratingCount?: number;
}): Json {
  const offers: Json | undefined = opts.price
    ? {
        "@type": "Offer",
        url: opts.url,
        priceCurrency: opts.currency ?? "NGN",
        price: opts.price,
        availability: opts.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: { "@id": `${SITE_URL}/#organization` },
      }
    : undefined;
  const ld: Json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    url: opts.url,
  };
  if (opts.image) ld.image = opts.image;
  if (opts.brand) ld.brand = { "@type": "Brand", name: opts.brand };
  if (opts.sku) ld.sku = opts.sku;
  if (offers) ld.offers = offers;
  if (opts.ratingCount && opts.ratingValue) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: opts.ratingValue,
      reviewCount: opts.ratingCount,
    };
  }
  return ld;
}

/** Blog article rich result. */
export function articleLd(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
  storeName: string;
}): Json {
  const ld: Json = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    author: { "@type": "Person", name: opts.author || opts.storeName },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
  if (opts.image) ld.image = opts.image;
  if (opts.publishedAt) ld.datePublished = opts.publishedAt;
  if (opts.updatedAt) ld.dateModified = opts.updatedAt;
  return ld;
}

/** Breadcrumb trail for richer SERP display. */
export function breadcrumbLd(items: { name: string; url: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  };
}
