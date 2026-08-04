import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { changePassword } from "@/lib/actions/users";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { error, success } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-serif text-3xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-muted">
        Signed in as {user.name} ({user.email})
      </p>

      <h2 className="mt-8 font-serif text-xl font-bold">Change password</h2>

      {error && (
        <p className="mt-4 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded-md border border-line bg-card px-3 py-2 text-sm">{success}</p>
      )}

      <form action={changePassword} className="mt-4 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Current password
          <input
            type="password"
            name="currentPassword"
            required
            className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          New password
          <input
            type="password"
            name="newPassword"
            required
            minLength={8}
            className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Confirm new password
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-md bg-accent px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
        >
          Update password
        </button>
      </form>
    </div>
  );
}
