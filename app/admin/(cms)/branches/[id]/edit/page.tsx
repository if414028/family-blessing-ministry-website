import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { BranchForm } from "@/components/admin/AdminForms";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSuperAdmin();
  const branch = await prisma.branch.findUnique({ where: { id: (await params).id } });
  if (!branch) notFound();
  return <><AdminPageHeader title={`Edit ${branch.name}`} /><BranchForm branch={branch} /></>;
}
