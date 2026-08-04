import ArticleCard from "@/components/ArticleCard";
import { listPublishedArticles } from "@/lib/queries";

export default async function Home() {
  const articles = await listPublishedArticles();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {articles.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl text-muted">The first issue is being typeset.</p>
          <p className="mt-2 text-sm text-muted">Check back soon for the newest stories.</p>
        </div>
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
