"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, destroySession, getSession } from "@/lib/auth";

export async function signup(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || !password) {
    redirect("/signup?error=" + encodeURIComponent("All fields are required."));
  }
  if (password.length < 8) {
    redirect("/signup?error=" + encodeURIComponent("Password must be at least 8 characters."));
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    redirect("/signup?error=" + encodeURIComponent("An account with that email already exists."));
  }

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM users`;
  const isFirstUser = count === 0;
  const passwordHash = await hashPassword(password);

  const rows = await sql`
    INSERT INTO users (name, email, password_hash, role, status)
    VALUES (${name}, ${email}, ${passwordHash}, ${isFirstUser ? "admin" : "writer"}, ${isFirstUser ? "approved" : "pending"})
    RETURNING id, role
  `;
  const user = rows[0];

  if (!isFirstUser) {
    redirect(
      "/login?success=" +
        encodeURIComponent("Account requested! A site admin needs to approve you before you can log in.")
    );
  }

  await createSession({ userId: user.id, role: user.role });
  redirect("/write");
}

export async function claimAccount(formData: FormData) {
  const userId = Number(formData.get("userId"));
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!userId) {
    redirect("/signup?error=" + encodeURIComponent("Choose your name from the list."));
  }
  if (password.length < 8) {
    redirect("/signup?error=" + encodeURIComponent("Password must be at least 8 characters."));
  }
  if (password !== confirmPassword) {
    redirect("/signup?error=" + encodeURIComponent("Passwords don't match."));
  }

  const rows = await sql`SELECT id, role FROM users WHERE id = ${userId} AND claimed = false`;
  const user = rows[0];
  if (!user) {
    redirect("/signup?error=" + encodeURIComponent("That account was already claimed. Refresh and try again."));
  }

  const passwordHash = await hashPassword(password);
  await sql`UPDATE users SET password_hash = ${passwordHash}, claimed = true WHERE id = ${userId}`;

  await createSession({ userId: user.id, role: user.role });
  redirect("/write");
}

export async function login(formData: FormData) {
  const userId = Number(formData.get("userId"));
  const password = String(formData.get("password") || "");

  const rows = await sql`SELECT id, role, status, password_hash FROM users WHERE id = ${userId}`;
  const user = rows[0];

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    redirect("/login?error=" + encodeURIComponent("Wrong password."));
  }
  if (user.status !== "approved") {
    redirect("/login?error=" + encodeURIComponent("Your account is awaiting admin approval."));
  }

  await createSession({ userId: user.id, role: user.role });
  redirect("/write");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

export async function approveWriter(formData: FormData) {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Not authorized");
  const userId = Number(formData.get("userId"));
  await sql`UPDATE users SET status = 'approved' WHERE id = ${userId}`;
  revalidatePath("/admin/writers");
}

export async function rejectWriter(formData: FormData) {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Not authorized");
  const userId = Number(formData.get("userId"));
  await sql`DELETE FROM users WHERE id = ${userId} AND status = 'pending'`;
  revalidatePath("/admin/writers");
}

export async function changePassword(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword.length < 8) {
    redirect("/profile?error=" + encodeURIComponent("New password must be at least 8 characters."));
  }
  if (newPassword !== confirmPassword) {
    redirect("/profile?error=" + encodeURIComponent("New passwords don't match."));
  }

  const rows = await sql`SELECT password_hash FROM users WHERE id = ${session.userId}`;
  const user = rows[0];
  if (!user || !(await verifyPassword(currentPassword, user.password_hash))) {
    redirect("/profile?error=" + encodeURIComponent("Current password is incorrect."));
  }

  const newHash = await hashPassword(newPassword);
  await sql`UPDATE users SET password_hash = ${newHash} WHERE id = ${session.userId}`;

  redirect("/profile?success=" + encodeURIComponent("Password updated."));
}
