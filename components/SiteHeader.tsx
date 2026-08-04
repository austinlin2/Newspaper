import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/lib/actions/users";
import { CATEGORIES } from "@/lib/categories";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 pt-8 pb-4 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Est. 2026</p>
        <Link href="/">
          <h1 className="font-serif text-5xl font-bold tracking-tight sm:text-6xl">Alpha Newspaper</h1>
        </Link>
        <p className="mt-1 text-sm text-muted">The student voice of Alpha High School</p>
      </div>
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-line px-6 py-3 text-sm">
        <Link href="/" className="font-medium hover:text-accent">
          Home
        </Link>
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/category/${encodeURIComponent(category)}`}
            className="hover:text-accent"
          >
            {category}
          </Link>
        ))}
        <Link href="/staff" className="hover:text-accent">
          Staff
        </Link>
        {user && (
          <span className="flex items-center gap-4 border-l border-line pl-6">
            <Link href="/write" className="hover:text-accent">
              Write
            </Link>
            <Link href="/pending" className="hover:text-accent">
              Pending
            </Link>
            {user.role === "admin" && (
              <Link href="/admin/writers" className="hover:text-accent">
                Admin
              </Link>
            )}
            <Link href="/profile" className="hover:text-accent">
              Profile
            </Link>
            <form action={logout}>
              <button type="submit" className="text-muted hover:text-accent">
                Log out
              </button>
            </form>
          </span>
        )}
      </nav>
    </header>
  );
}
