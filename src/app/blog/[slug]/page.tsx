import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { Markdown } from "@/components/blog/markdown";
import { BlogCard } from "@/features/blog/blog-card";
import { getPostBySlug, getPosts } from "@/lib/blog";
import { getStoreConfig } from "@/lib/config";
import { absoluteUrl, articleLd, breadcrumbLd } from "@/lib/seo";

export const revalidate = 300;

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;
  const url = `/blog/${post.slug}`;
  const image = post.cover?.detail;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: post.author_name ? [post.author_name] : undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const [{ name: storeName }, related] = await Promise.all([
    getStoreConfig(),
    getPosts({ category: post.category?.slug }).catch(() => ({ results: [] })),
  ]);
  const more = related.results.filter((p) => p.id !== post.id).slice(0, 3);
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <article className="py-10 sm:py-14">
      <JsonLd
        data={articleLd({
          title: post.title,
          description: post.meta_description || post.excerpt,
          url,
          image: post.cover?.detail,
          author: post.author_name,
          publishedAt: post.published_at,
          updatedAt: post.updated_at,
          storeName,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "/" },
          { name: "Journal", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />

      <div className="container-site max-w-3xl">
        <nav className="mb-7 text-xs uppercase tracking-[0.12em] text-ink/40">
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link href="/blog" className="transition hover:text-primary">
            Journal
          </Link>
        </nav>

        <header>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/45">
            {post.category && (
              <>
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="text-accent hover:underline"
                >
                  {post.category.name}
                </Link>
                <span>·</span>
              </>
            )}
            <span>{post.reading_minutes} min read</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 text-sm text-ink/50">
            {fmtDate(post.published_at)}
            {post.author_name ? ` · by ${post.author_name}` : ""}
          </div>
        </header>
      </div>

      {post.cover && (
        <div className="container-site mt-8 max-w-4xl">
          <div className="relative aspect-[16/9] overflow-hidden bg-blush">
            <Image
              src={post.cover.detail}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 56rem"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="container-site mt-10 max-w-3xl">
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-ink prose-p:text-ink/75 prose-a:text-primary prose-strong:text-ink prose-img:w-full">
          <Markdown>{post.body}</Markdown>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-ink/10 pt-6">
            {post.tags.map((t) => (
              <span
                key={t}
                className="bg-blush px-3 py-1 text-xs font-medium text-ink/60"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {more.length > 0 && (
        <section className="container-site mt-16 max-w-5xl border-t border-ink/10 pt-12">
          <h2 className="mb-8 font-display text-2xl font-bold text-ink">
            Keep reading
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
            {more.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
