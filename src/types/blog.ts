import type { ImageUrls } from "./catalog";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type BlogPostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover: ImageUrls | null;
  category: BlogCategory | null;
  tags: string[];
  published_at: string | null;
  reading_minutes: number;
  author_name: string;
};

export type BlogPostDetail = BlogPostListItem & {
  body: string;
  meta_title: string;
  meta_description: string;
  updated_at: string;
};
