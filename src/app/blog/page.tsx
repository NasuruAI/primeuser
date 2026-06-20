import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { BlogCard } from "@/features/blog/blog-card";
import { getBlogCategories, getPosts } from "@/lib/blog";
import { SITE_LOCATION } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Journal — Style, Fashion & Guides",
  description: `Style guides, fashion tips and the latest from our clothing store in ${SITE_LOCATION}.`,
  alternates: { canonical: "/blog" },
};

export const revalidate = 300;

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [posts, categories] = await Promise.all([
    getPosts({ category: searchParams.category }).catch(() => ({ results: [] })),
    getBlogCategories().catch(() => []),
  ]);
  const items = posts.results;
  const active = searchParams.category;

  return (
    <div className="container-site py-12 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <span className="eyebrow">The Journal</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
          Style notes & fashion guides
        </h1>
        <p className="mt-3 text-ink/60">
          Tips, trends and how-tos from our team — fresh from {SITE_LOCATION}.
        </p>
      </header>

      {categories.length > 0 && (
        <nav className="mb-10 flex flex-wrap gap-1.5 border-b border-ink/10 pb-5 text-sm">
          <Link
            href="/blog"
            className={`px-4 py-1.5 text-[13px] font-medium uppercase tracking-[0.06em] transition ${
              !active ? "bg-ink text-canvas" : "text-ink/60 hover:text-ink"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/blog?category=${c.slug}`}
              className={`px-4 py-1.5 text-[13px] font-medium uppercase tracking-[0.06em] transition ${
                active === c.slug
                  ? "bg-ink text-canvas"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      )}

      {items.length === 0 ? (
        <div className="border border-dashed border-ink/15 bg-white p-16 text-center text-ink/55">
          No posts yet — check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 70}>
              <BlogCard post={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
