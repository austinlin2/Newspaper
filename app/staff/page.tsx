import { listApprovedWriters } from "@/lib/queries";

export default async function StaffPage() {
  const staff = await listApprovedWriters();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-serif text-3xl font-bold">Staff</h1>
      <p className="mt-1 text-sm text-muted">The people behind Alpha Newspaper.</p>

      <div className="mt-8 flex flex-col divide-y divide-line border-y border-line">
        {staff.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-4 py-4">
            <p className="font-serif text-lg font-semibold">{member.name}</p>
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">Editor</span>
          </div>
        ))}
      </div>
    </div>
  );
}
