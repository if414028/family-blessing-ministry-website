import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminShell";
import { branchScopedWhere, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSermonsPage() {
  const user = await requireCurrentUser();
  type AdminSermon = Prisma.SermonGetPayload<{ include: { branch: true } }>;
  const sermons: AdminSermon[] = await prisma.sermon.findMany({ where: branchScopedWhere(user), include: { branch: true }, orderBy: { date: "desc" } }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Sermons" action={<Link className="rounded-full bg-[#0066cc] px-5 py-2.5 text-white" href="/admin/sermons/new">Tambah Sermon</Link>} />
      <div className="admin-list">{sermons.length ? sermons.map((sermon: AdminSermon) => <div key={sermon.id} className="admin-list-row grid items-center gap-3 border-b border-[#e8e8ed] p-4 last:border-0 md:grid-cols-[1fr_150px_130px_90px] md:px-5"><div><p className="font-semibold">{sermon.title}</p><p className="mt-1 text-sm text-[#6e6e73]">{sermon.speaker}</p></div><span className="text-sm text-[#333333]">{formatDate(sermon.date)}</span><StatusBadge>{sermon.status}</StatusBadge><Link className="admin-text-link" href={`/admin/sermons/${sermon.id}/edit`}>Edit</Link></div>) : <div className="admin-empty">Belum ada sermon yang dibuat.</div>}</div>
    </div>
  );
}
