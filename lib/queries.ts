import { sql, type ArticleWithAuthor, type Article, type User } from "@/lib/db";

export async function listPublishedArticles(category?: string): Promise<ArticleWithAuthor[]> {
  const rows = category
    ? await sql`
        SELECT a.*, u.name AS author_name FROM articles a
        JOIN users u ON u.id = a.author_id
        WHERE a.status = 'published' AND a.category = ${category}
        ORDER BY a.published_at DESC
      `
    : await sql`
        SELECT a.*, u.name AS author_name FROM articles a
        JOIN users u ON u.id = a.author_id
        WHERE a.status = 'published'
        ORDER BY a.published_at DESC
      `;
  return rows as ArticleWithAuthor[];
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithAuthor | null> {
  const rows = await sql`
    SELECT a.*, u.name AS author_name FROM articles a
    JOIN users u ON u.id = a.author_id
    WHERE a.slug = ${slug}
  `;
  return (rows[0] as ArticleWithAuthor) ?? null;
}

export async function getArticleById(id: number): Promise<Article | null> {
  const rows = await sql`SELECT * FROM articles WHERE id = ${id}`;
  return (rows[0] as Article) ?? null;
}

export async function listArticlesByAuthor(authorId: number): Promise<Article[]> {
  const rows = await sql`
    SELECT * FROM articles WHERE author_id = ${authorId} ORDER BY updated_at DESC
  `;
  return rows as Article[];
}

export async function listAllArticles(): Promise<ArticleWithAuthor[]> {
  const rows = await sql`
    SELECT a.*, u.name AS author_name FROM articles a
    JOIN users u ON u.id = a.author_id
    ORDER BY a.updated_at DESC
  `;
  return rows as ArticleWithAuthor[];
}

export async function listPendingWriters(): Promise<User[]> {
  const rows = await sql`SELECT * FROM users WHERE status = 'pending' ORDER BY created_at ASC`;
  return rows as User[];
}

export async function listApprovedWriters(): Promise<User[]> {
  const rows = await sql`SELECT * FROM users WHERE status = 'approved' ORDER BY name ASC`;
  return rows as User[];
}
