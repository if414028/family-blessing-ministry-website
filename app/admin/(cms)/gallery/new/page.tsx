import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AlbumForm } from "@/components/admin/AdminForms";
import { isSuperAdmin, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewAlbumPage() {
  const user = await requireCurrentUser();
  const branches = await prisma.branch.findMany({
    where: isSuperAdmin(user) ? {} : { id: user.branchId ?? "__no_branch__" },
    orderBy: { name: "asc" },
  }).catch(() => []);
  return <><AdminPageHeader title="Tambah Album" /><AlbumForm branches={branches} /></>;
}
