import Link from "next/link";
import { signup } from "@/lib/actions/users";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-serif text-3xl font-bold">Join as a writer</h1>
      <p className="mt-1 text-sm text-muted">
        New accounts need admin approval before you can log in.
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          {error}
        </p>
      )}

      <form action={signup} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Name
          <input
            type="text"
            name="name"
            required
            className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-md bg-accent px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
        >
          Request account
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already approved?{" "}
        <Link href="/login" className="text-accent underline">
          Log in
        </Link>
        .
      </p>
    </div>
  );
}
