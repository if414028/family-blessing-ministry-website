import type { Prisma } from "@prisma/client";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminShell";
import { createUser } from "@/lib/actions";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireSuperAdmin();
  type AdminUser = Prisma.UserGetPayload<{ include: { branch: true } }>;
  type AdminBranch = Prisma.BranchGetPayload<object>;
  const users: AdminUser[] = await prisma.user.findMany({ include: { branch: true }, orderBy: { createdAt: "asc" } }).catch(() => []);
  const branches: AdminBranch[] = await prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Users" description="Buat akun super admin atau akun cabang untuk mengelola konten branch masing-masing." />
      <form action={createUser} className="mb-6 grid gap-4 rounded-[18px] bg-white p-6 md:grid-cols-2 xl:grid-cols-5">
        <label className="grid gap-1 text-sm font-medium">Nama<input className="admin-field" name="name" required /></label>
        <label className="grid gap-1 text-sm font-medium">Email<input className="admin-field" name="email" type="email" required /></label>
        <label className="grid gap-1 text-sm font-medium">Password<input className="admin-field" name="password" type="password" minLength={8} required /></label>
        <label className="grid gap-1 text-sm font-medium">Role<select className="admin-field" name="role" defaultValue="BRANCH_ADMIN"><option value="BRANCH_ADMIN">Branch Admin</option><option value="SUPER_ADMIN">Super Admin</option><option value="ADMIN">Admin</option><option value="EDITOR">Editor</option></select></label>
        <label className="grid gap-1 text-sm font-medium">Cabang<select className="admin-field" name="branchId"><option value="">-</option>{branches.map((branch: AdminBranch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
        <button className="rounded-full bg-[#0066cc] px-5 py-3 text-white xl:col-span-5">Tambah User</button>
      </form>
      <div className="overflow-hidden rounded-[18px] bg-white">{users.map((user: AdminUser) => <div key={user.id} className="grid gap-3 border-b border-[#e0e0e0] p-4 md:grid-cols-[1fr_180px_150px]"><div><p className="font-semibold">{user.name}</p><p className="text-sm text-[#7a7a7a]">{user.email}</p>{user.branch ? <p className="mt-1 text-sm text-[#7a7a7a]">{user.branch.name}</p> : null}</div><StatusBadge>{user.role}</StatusBadge><StatusBadge>{user.branch?.city ?? "Global"}</StatusBadge></div>)}</div>
    </div>
  );
}
