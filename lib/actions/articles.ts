"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { CATEGORIES } from "@/lib/categories";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function uniqueSlug(base: string) {
  const root = base || "article";
  let slug = root;
  let attempt = 1;
  while (true) {
    const rows = await sql`SELECT id FROM articles WHERE slug = ${slug}`;
    if (rows.length === 0) return slug;
    attempt += 1;
    slug = `${root}-${attempt}`;
  }
}

async function uploadCoverImage(image: FormDataEntryValue | null) {
  if (!image || !(image instanceof File) || image.size === 0) return null;
  const blob = await put(`covers/${Date.now()}-${image.name}`, image, { access: "public" });
  return blob.url;
}

async function requireWriter() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function createArticle(formData: FormData) {
  const session = await requireWriter();

  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const category = String(formData.get("category") || CATEGORIES[0]);
  const intent = String(formData.get("intent") || "draft");

  if (!title || !body) {
    redirect("/write/new?error=" + encodeURIComponent("Title and body are required."));
  }

  const coverImageUrl = await uploadCoverImage(formData.get("coverImage"));
  const slug = await uniqueSlug(slugify(title));
  const status = intent === "publish" ? "published" : "draft";
  const publishedAt = status === "published" ? new Date().toISOString() : null;

  await sql`
    INSERT INTO articles (slug, title, excerpt, body, category, cover_image_url, author_id, status, published_at)
    VALUES (${slug}, ${title}, ${excerpt}, ${body}, ${category}, ${coverImageUrl}, ${session.userId}, ${status}, ${publishedAt})
  `;

  revalidatePath("/write");
  revalidatePath("/");
  redirect("/write");
}

export async function updateArticle(formData: FormData) {
  const session = await requireWriter();
  const id = Number(formData.get("id"));

  const rows = await sql`SELECT * FROM articles WHERE id = ${id}`;
  const article = rows[0];
  if (!article) redirect("/write");
  if (article.author_id !== session.userId && session.role !== "admin") {
    throw new Error("Not authorized");
  }

  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const category = String(formData.get("category") || CATEGORIES[0]);
  const intent = String(formData.get("intent") || "draft");

  if (!title || !body) {
    redirect(`/write/${id}/edit?error=` + encodeURIComponent("Title and body are required."));
  }

  const uploadedUrl = await uploadCoverImage(formData.get("coverImage"));
  const coverImageUrl = uploadedUrl ?? article.cover_image_url;

  const wasPublished = article.status === "published";
  const status = intent === "publish" ? "published" : "draft";
  const publishedAt = status === "published" ? (wasPublished ? article.published_at : new Date().toISOString()) : null;

  await sql`
    UPDATE articles
    SET title = ${title}, excerpt = ${excerpt}, body = ${body}, category = ${category},
        cover_image_url = ${coverImageUrl}, status = ${status}, published_at = ${publishedAt},
        updated_at = now()
    WHERE id = ${id}
  `;

  revalidatePath("/write");
  revalidatePath("/");
  revalidatePath(`/article/${article.slug}`);
  redirect("/write");
}

export async function deleteArticle(formData: FormData) {
  const session = await requireWriter();
  const id = Number(formData.get("id"));

  const rows = await sql`SELECT author_id FROM articles WHERE id = ${id}`;
  const article = rows[0];
  if (!article) return;
  if (article.author_id !== session.userId && session.role !== "admin") {
    throw new Error("Not authorized");
  }

  await sql`DELETE FROM articles WHERE id = ${id}`;
  revalidatePath("/write");
  revalidatePath("/");
}
