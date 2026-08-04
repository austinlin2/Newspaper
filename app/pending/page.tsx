import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listPendingArticles, PENDING_WINDOW_MS } from "@/lib/queries";
import { sendBackToDraft } from "@/lib/actions/articles";

function formatTimeLeft(submittedAt: string | null) {
  if (!submittedAt) return "—";
  const remainingMs = new Date(submittedAt).getTime() + PENDING_WINDOW_MS - Date.now();
  if (remainingMs <= 0) return "Publishing shortly";
  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export default async function PendingPage() {
  const user = await getCurrentUser();
  const articles = await listPendingArticles();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-serif text-3xl font-bold">Pending</h1>
      <p className="mt-1 text-sm text-muted">
        New articles wait here for 2 hours before going live automatically. The writer can still
        edit or withdraw theirs during that window.
      </p>

      {articles.length === 0 ? (
        <p className="mt-10 text-center text-muted">Nothing pending right now.</p>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-line border-y border-line">
          {articles.map((article) => {
            const canManage = article.author_id === user?.id || user?.role === "admin";
            return (
              <div key={article.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-serif text-lg font-semibold">{article.title}</p>
                  <p className="text-xs text-muted">
                    {article.category} · By {article.author_name} ·{" "}
                    <span className="font-medium text-accent">{formatTimeLeft(article.submitted_at)}</span>
                  </p>
                </div>
                {canManage && (
                  <div className="flex shrink-0 items-center gap-3 text-sm">
                    <Link href={`/write/${article.id}/edit`} className="text-accent underline">
                      Edit
                    </Link>
                    <form action={sendBackToDraft}>
                      <input type="hidden" name="id" value={article.id} />
                      <button type="submit" className="text-muted hover:text-accent">
                        Withdraw to draft
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
