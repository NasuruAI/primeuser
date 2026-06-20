import Image from "next/image";
import Link from "next/link";

import type { BlogPostListItem } from "@/types/blog";

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogPostListItem }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-blush">
        {post.cover ? (
          <Image
            src={post.cover.card}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink/25">
            {post.title}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/45">
          {post.category && (
            <>
              <span className="text-accent">{post.category.name}</span>
              <span>·</span>
            </>
          )}
          <span>{post.reading_minutes} min read</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-bold leading-snug text-ink transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/60">
            {post.excerpt}
          </p>
        )}
        <div className="mt-3 text-xs text-ink/40">
          {fmtDate(post.published_at)}
          {post.author_name ? ` · ${post.author_name}` : ""}
        </div>
      </div>
    </Link>
  );
}
