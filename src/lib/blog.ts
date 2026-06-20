import "server-only";

import { ApiRequestError, backendFetch } from "./api";
import type { Paginated } from "@/types/catalog";
import type {
  BlogCategory,
  BlogPostDetail,
  BlogPostListItem,
} from "@/types/blog";

export async function getPosts(
  params: { category?: string; tag?: string; search?: string; page?: number } = {},
): Promise<Paginated<BlogPostListItem>> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.tag) qs.set("tag", params.tag);
  if (params.search) qs.set("search", params.search);
  if (params.page) qs.set("page", String(params.page));
  const suffix = qs.toString() ? `?${qs}` : "";
  return backendFetch<Paginated<BlogPostListItem>>(`/blog/posts/${suffix}`);
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  try {
    return await backendFetch<BlogPostDetail>(`/blog/posts/${slug}/`);
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) return null;
    throw err;
  }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const data = await backendFetch<Paginated<BlogCategory>>("/blog/categories/");
  return data.results;
}

export async function getBlogCategory(
  slug: string,
): Promise<BlogCategory | null> {
  try {
    return await backendFetch<BlogCategory>(`/blog/categories/${slug}/`);
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) return null;
    throw err;
  }
}
