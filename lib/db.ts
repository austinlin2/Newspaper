import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export type UserRole = "admin" | "writer";
export type UserStatus = "pending" | "approved";
export type ArticleStatus = "draft" | "published";

export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
};

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image_url: string | null;
  author_id: number;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticleWithAuthor = Article & { author_name: string };
