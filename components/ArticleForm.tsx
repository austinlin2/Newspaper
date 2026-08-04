import { CATEGORIES } from "@/lib/categories";
import type { Article } from "@/lib/db";

export default function ArticleForm({
  action,
  article,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  article?: Article;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      {article && <input type="hidden" name="id" value={article.id} />}

      {error && (
        <p className="rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          {error}
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm font-medium">
        Title
        <input
          type="text"
          name="title"
          required
          defaultValue={article?.title}
          className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Category
        <select
          name="category"
          defaultValue={article?.category ?? CATEGORIES[0]}
          className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Excerpt
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={article?.excerpt}
          placeholder="A short teaser shown on the homepage"
          className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Cover image {article?.cover_image_url && "(leave blank to keep current image)"}
        <input
          type="file"
          name="coverImage"
          accept="image/*"
          className="rounded-md border border-line bg-card px-3 py-2 text-sm"
        />
      </label>
      {article?.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.cover_image_url} alt="" className="h-32 w-auto rounded-md object-cover" />
      )}

      <label className="flex flex-col gap-1 text-sm font-medium">
        Body
        <textarea
          name="body"
          rows={16}
          required
          defaultValue={article?.body}
          className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
        />
      </label>

      {article?.status === "published" ? (
        <div className="flex gap-3">
          <button
            type="submit"
            name="intent"
            value="draft"
            className="rounded-md bg-accent px-4 py-2 font-medium text-white hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            type="submit"
            name="intent"
            value="draft"
            className="rounded-md border border-line px-4 py-2 font-medium hover:border-accent"
          >
            Save draft
          </button>
          <button
            type="submit"
            name="intent"
            value="pending"
            className="rounded-md bg-accent px-4 py-2 font-medium text-white hover:opacity-90"
          >
            Submit — goes live in 2 hours
          </button>
        </div>
      )}
    </form>
  );
}
