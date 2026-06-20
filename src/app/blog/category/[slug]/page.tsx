import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/ui/reveal";
import { BlogCard } from "@/features/blog/blog-card";
import { getBlogCategory, getPosts } from "@/lib/blog";
import { SITE_LOCATION } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cat = await getBlogCategory(params.slug);
  if (!cat) return { title: "Category" };
  return {
    title: `${cat.name} — Journal`,
    description:
      cat.description ||
      `${cat.name} articles, style guides and tips from our clothing store in ${SITE_LOCATION}.`,
    alternates: { canonical: `/blog/category/${cat.slug}` },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const cat = await getBlogCategory(params.slug);
  if (!cat) notFound();
  const posts = await getPosts({ category: cat.slug }).catch(() => ({
    results: [],
  }));

  return (
    <div className="container-site py-12 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <nav className="mb-3 text-xs uppercase tracking-[0.12em] text-ink/40">
          <Link href="/blog" className="transition hover:text-primary">
            Journal
          </Link>
          <span className="px-2">/</span>
          <span className="text-ink/70">{cat.name}</span>
        </nav>
        <span className="eyebrow">Category</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
          {cat.name}
        </h1>
        {cat.description && (
          <p className="mt-3 text-ink/60">{cat.description}</p>
        )}
      </header>

      {posts.results.length === 0 ? (
        <div className="border border-dashed border-ink/15 bg-white p-16 text-center text-ink/55">
          No posts in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.results.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 70}>
              <BlogCard post={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
