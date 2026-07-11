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
      <div className="overflow-hidden rounded-[18px] bg-white">{events.map((event: AdminEvent) => <div key={event.id} className="grid gap-3 border-b border-[#e0e0e0] p-4 md:grid-cols-[1fr_150px_130px_90px]"><div><p className="font-semibold">{event.title}</p><p className="text-sm text-[#7a7a7a]">{event.branch?.name ?? event.location}</p></div><span>{formatDate(event.startDate)}</span><StatusBadge>{event.status}</StatusBadge><Link className="text-[#0066cc]" href={`/admin/events/${event.id}/edit`}>Edit</Link></div>)}</div>
    </div>
  );
}
