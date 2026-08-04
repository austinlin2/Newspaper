import Link from "next/link";
import type { ArticleWithAuthor } from "@/lib/db";

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticleCard({ article }: { article: ArticleWithAuthor }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-card transition-shadow hover:shadow-md"
    >
      {article.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.cover_image_url}
          alt=""
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-line/40 font-serif text-3xl text-muted">
          A
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          {article.category}
        </span>
        <h2 className="font-serif text-xl font-bold leading-snug group-hover:text-accent">
          {article.title}
        </h2>
        <p className="line-clamp-3 flex-1 text-sm text-muted">{article.excerpt}</p>
        <p className="text-xs text-muted">
          By {article.author_name} · {formatDate(article.published_at)}
        </p>
      </div>
    </Link>
  );
}
