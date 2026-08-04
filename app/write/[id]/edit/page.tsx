import { notFound, redirect } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";
import { updateArticle } from "@/lib/actions/articles";
import { getArticleById } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const user = await getCurrentUser();
  const article = await getArticleById(Number(id));

  if (!article) notFound();
  if (!user || (article.author_id !== user.id && user.role !== "admin")) {
    redirect("/write");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 font-serif text-3xl font-bold">Edit article</h1>
      <ArticleForm action={updateArticle} article={article} error={error} />
    </div>
  );
}
