import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const user = await getCurrentUser();

  const canPreview = article?.status === "pending" && Boolean(user);
  if (!article || (article.status !== "published" && !canPreview)) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-2xl px-6 py-10">
      {article.status === "pending" && (
        <p className="mb-4 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          Staff preview — this article hasn&apos;t published yet.
        </p>
      )}
      <Link
        href={`/category/${encodeURIComponent(article.category)}`}
        className="text-xs font-semibold uppercase tracking-wide text-accent"
      >
        {article.category}
      </Link>
      <h1 className="mt-3 font-serif text-4xl font-bold leading-tight">{article.title}</h1>
      <p className="mt-3 text-sm text-muted">
        By {article.author_name}
        {article.published_at && ` · ${formatDate(article.published_at)}`}
      </p>
      {article.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.cover_image_url}
          alt=""
          className="mt-6 w-full rounded-lg object-cover"
        />
      )}
      <div className="prose mt-8 whitespace-pre-wrap text-base leading-7">{article.body}</div>
    </article>
  );
}
