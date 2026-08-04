import Link from "next/link";
import { listAllArticles } from "@/lib/queries";
import { deleteArticle } from "@/lib/actions/articles";

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminArticlesPage() {
  const articles = await listAllArticles();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">All articles</h1>
        <Link href="/admin/writers" className="text-sm text-accent underline">
          Manage writers
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="mt-10 text-center text-muted">No articles yet.</p>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-line border-y border-line">
          {articles.map((article) => (
            <div key={article.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-serif text-lg font-semibold">{article.title}</p>
                <p className="text-xs text-muted">
                  {article.category} · By {article.author_name} ·{" "}
                  <span className={article.status === "published" ? "text-accent" : "text-muted"}>
                    {article.status === "published" ? "Published" : "Draft"}
                  </span>{" "}
                  · Updated {formatDate(article.updated_at)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm">
                <Link href={`/write/${article.id}/edit`} className="text-accent underline">
                  Edit
                </Link>
                <form action={deleteArticle}>
                  <input type="hidden" name="id" value={article.id} />
                  <button type="submit" className="text-muted hover:text-accent">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
