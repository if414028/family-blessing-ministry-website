import { notFound, redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { SermonForm } from "@/components/admin/AdminForms";
import { isSuperAdmin, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditSermonPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, user] = await Promise.all([params, requireCurrentUser()]);
  const [sermon, branches] = await Promise.all([
    prisma.sermon.findUnique({ where: { id } }),
    prisma.branch.findMany({
      where: isSuperAdmin(user) ? {} : { id: user.branchId ?? "__no_branch__" },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!sermon) notFound();
  if (!isSuperAdmin(user) && sermon.branchId !== user.branchId) redirect("/admin/sermons");
  return <><AdminPageHeader title={`Edit ${sermon.title}`} /><SermonForm sermon={sermon} branches={branches} /></>;
}
