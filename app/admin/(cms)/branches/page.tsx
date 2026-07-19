import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminShell";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBranchesPage() {
  await requireSuperAdmin();
  type AdminBranch = Prisma.BranchGetPayload<object>;
  const branches: AdminBranch[] = await prisma.branch.findMany({ orderBy: [{ sortOrder: "asc" }, { city: "asc" }] }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Branches" action={<Link className="rounded-full bg-[#0066cc] px-5 py-2.5 text-white" href="/admin/branches/new">Tambah Cabang</Link>} />
      <div className="admin-list">
        {branches.length ? branches.map((branch: AdminBranch) => <div key={branch.id} className="admin-list-row grid items-center gap-3 border-b border-[#e8e8ed] p-4 last:border-0 md:grid-cols-[1fr_160px_120px_90px] md:px-5"><div><p className="font-semibold">{branch.name}</p><p className="mt-1 text-sm text-[#6e6e73]">{branch.city}, {branch.country}</p></div><StatusBadge>{branch.type}</StatusBadge><StatusBadge>{branch.isActive ? "Active" : "Inactive"}</StatusBadge><Link className="admin-text-link" href={`/admin/branches/${branch.id}/edit`}>Edit</Link></div>) : <div className="admin-empty">Belum ada cabang yang ditambahkan.</div>}
      </div>
    </div>
  );
}
