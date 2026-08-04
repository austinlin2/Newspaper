import { listPendingWriters, listApprovedWriters } from "@/lib/queries";
import { approveWriter, rejectWriter } from "@/lib/actions/users";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminWritersPage() {
  const [pending, approved] = await Promise.all([listPendingWriters(), listApprovedWriters()]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-serif text-3xl font-bold">Writers</h1>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Pending approval ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No pending requests.</p>
        ) : (
          <div className="mt-3 flex flex-col divide-y divide-line border-y border-line">
            {pending.map((writer) => (
              <div key={writer.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{writer.name}</p>
                  <p className="text-xs text-muted">
                    {writer.email} · requested {formatDate(writer.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3 text-sm">
                  <form action={approveWriter}>
                    <input type="hidden" name="userId" value={writer.id} />
                    <button type="submit" className="text-accent underline">
                      Approve
                    </button>
                  </form>
                  <form action={rejectWriter}>
                    <input type="hidden" name="userId" value={writer.id} />
                    <button type="submit" className="text-muted hover:text-accent">
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Approved writers ({approved.length})
        </h2>
        <div className="mt-3 flex flex-col divide-y divide-line border-y border-line">
          {approved.map((writer) => (
            <div key={writer.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium">
                  {writer.name} {writer.role === "admin" && <span className="text-xs text-accent">Admin</span>}
                </p>
                <p className="text-xs text-muted">{writer.email}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
