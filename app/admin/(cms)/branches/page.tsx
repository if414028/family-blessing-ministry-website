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
      <div className="overflow-hidden rounded-[18px] bg-white">
        {branches.map((branch: AdminBranch) => <div key={branch.id} className="grid gap-3 border-b border-[#e0e0e0] p-4 md:grid-cols-[1fr_160px_120px_90px]"><div><p className="font-semibold">{branch.name}</p><p className="text-sm text-[#7a7a7a]">{branch.city}, {branch.country}</p></div><StatusBadge>{branch.type}</StatusBadge><StatusBadge>{branch.isActive ? "Active" : "Hidden"}</StatusBadge><Link className="text-[#0066cc]" href={`/admin/branches/${branch.id}/edit`}>Edit</Link></div>)}
      </div>
    </div>
  );
}
