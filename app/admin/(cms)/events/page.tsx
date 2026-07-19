import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminShell";
import { branchScopedWhere, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const user = await requireCurrentUser();
  type AdminEvent = Prisma.EventGetPayload<{ include: { branch: true } }>;
  const events: AdminEvent[] = await prisma.event.findMany({ where: branchScopedWhere(user), include: { branch: true }, orderBy: { startDate: "desc" } }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Events" action={<Link className="rounded-full bg-[#0066cc] px-5 py-2.5 text-white" href="/admin/events/new">Tambah Event</Link>} />
      <div className="admin-list">{events.length ? events.map((event: AdminEvent) => <div key={event.id} className="admin-list-row grid items-center gap-3 border-b border-[#e8e8ed] p-4 last:border-0 md:grid-cols-[1fr_150px_130px_90px] md:px-5"><div><p className="font-semibold">{event.title}</p><p className="mt-1 text-sm text-[#6e6e73]">{event.branch?.name ?? event.location}</p></div><span className="text-sm text-[#333333]">{formatDate(event.startDate)}</span><StatusBadge>{event.status}</StatusBadge><Link className="admin-text-link" href={`/admin/events/${event.id}/edit`}>Edit</Link></div>) : <div className="admin-empty">Belum ada event yang dibuat.</div>}</div>
    </div>
  );
}
