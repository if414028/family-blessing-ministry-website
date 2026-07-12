import { AdminPageHeader } from "@/components/admin/AdminShell";
import { EventForm } from "@/components/admin/EventForm";
import { isSuperAdmin, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const user = await requireCurrentUser();
  const branches = await prisma.branch.findMany({
    where: isSuperAdmin(user) ? {} : { id: user.branchId ?? "__no_branch__" },
    orderBy: { name: "asc" },
  }).catch(() => []);
  return <><AdminPageHeader title="Tambah Event" /><EventForm branches={branches} /></>;
}
