import ArticleForm from "@/components/ArticleForm";
import { createArticle } from "@/lib/actions/articles";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 font-serif text-3xl font-bold">New article</h1>
      <ArticleForm action={createArticle} error={error} />
    </div>
  );
}
