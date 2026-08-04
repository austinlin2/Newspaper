import Link from "next/link";
import { signup, claimAccount } from "@/lib/actions/users";
import { listUnclaimedWriters } from "@/lib/queries";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; mode?: string }>;
}) {
  const { error, mode } = await searchParams;
  const unclaimed = await listUnclaimedWriters();
  const showClaimForm = unclaimed.length > 0 && mode !== "new";

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-serif text-3xl font-bold">Join as a writer</h1>
      <p className="mt-1 text-sm text-muted">
        {showClaimForm
          ? "Pick your name and set a password to activate your account."
          : "New accounts need admin approval before you can log in."}
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          {error}
        </p>
      )}

      {showClaimForm ? (
        <>
          <form action={claimAccount} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium">
              I am
              <select
                name="userId"
                required
                defaultValue=""
                className="rounded-md border border-line bg-card px-3 py-2 text-base outline-none focus:border-accent"
              >
                <option value="" disabled>
                  Select your name
                </option>
                {unclaimed.map((writer) => (
                  <option key={writer.id} value={writer.id}>
                    {writer.name}
                  </option>
                ))}
              </select>
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
            <label className="flex flex-col gap-1 text-sm font-medium">
              Confirm password
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
              Activate account
            </button>
          </form>

          <p className="mt-6 text-sm text-muted">
            Not on this list?{" "}
            <Link href="/signup?mode=new" className="text-accent underline">
              Request a new account
            </Link>
            .
          </p>
        </>
      ) : (
        <>
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

          {unclaimed.length > 0 && (
            <p className="mt-6 text-sm text-muted">
              Already on staff?{" "}
              <Link href="/signup" className="text-accent underline">
                Choose your name instead
              </Link>
              .
            </p>
          )}
        </>
      )}

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
