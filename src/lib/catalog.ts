import "server-only";

import { ApiRequestError, backendFetch } from "./api";
import type {
  Category,
  Paginated,
  ProductDetail,
  ProductListItem,
  Review,
} from "@/types/catalog";

export async function getCategories(): Promise<Category[]> {
  return backendFetch<Category[]>("/catalog/categories/");
}

export async function getProducts(
  params: {
    category?: string;
    search?: string;
    currency?: string;
    ordering?: string;
    flash?: boolean;
  } = {},
): Promise<Paginated<ProductListItem>> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category__slug", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.currency) qs.set("currency", params.currency);
  if (params.ordering) qs.set("ordering", params.ordering);
  if (params.flash) qs.set("is_flash_sale", "true");
  const suffix = qs.toString() ? `?${qs}` : "";
  return backendFetch<Paginated<ProductListItem>>(
    `/catalog/products/${suffix}`,
  );
}

/** Resolve a product by share handle (slug or short_id) — used by /p/<handle>. */
export async function getProductByHandle(
  handle: string,
  currency?: string,
): Promise<ProductDetail | null> {
  const suffix = currency ? `?currency=${encodeURIComponent(currency)}` : "";
  try {
    return await backendFetch<ProductDetail>(
      `/catalog/share/${handle}/${suffix}`,
    );
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) return null;
    throw err;
  }
}

export async function getReviews(slug: string): Promise<Review[]> {
  try {
    const data = await backendFetch<Paginated<Review>>(
      `/catalog/products/${slug}/reviews/`,
    );
    return data.results;
  } catch {
    return [];
  }
}
