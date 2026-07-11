import Link from "next/link";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminShell";
import { branchScopedWhere, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSermonsPage() {
  const user = await requireCurrentUser();
  const sermons = await prisma.sermon.findMany({ where: branchScopedWhere(user), include: { branch: true }, orderBy: { date: "desc" } }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Sermons" action={<Link className="rounded-full bg-[#0066cc] px-5 py-2.5 text-white" href="/admin/sermons/new">Tambah Sermon</Link>} />
      <div className="overflow-hidden rounded-[18px] bg-white">{sermons.map((sermon) => <div key={sermon.id} className="grid gap-3 border-b border-[#e0e0e0] p-4 md:grid-cols-[1fr_150px_130px_90px]"><div><p className="font-semibold">{sermon.title}</p><p className="text-sm text-[#7a7a7a]">{sermon.speaker}</p></div><span>{formatDate(sermon.date)}</span><StatusBadge>{sermon.status}</StatusBadge><Link className="text-[#0066cc]" href={`/admin/sermons/${sermon.id}/edit`}>Edit</Link></div>)}</div>
    </div>
  );
}
