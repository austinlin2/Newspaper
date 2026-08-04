import ArticleCard from "@/components/ArticleCard";
import { listPublishedArticles } from "@/lib/queries";
import { CATEGORIES } from "@/lib/categories";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);

  if (!CATEGORIES.includes(decoded)) {
    notFound();
  }

  const articles = await listPublishedArticles(decoded);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="mb-6 font-serif text-3xl font-bold">{decoded}</h2>
      {articles.length === 0 ? (
        <p className="py-16 text-center text-muted">No articles in this section yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
