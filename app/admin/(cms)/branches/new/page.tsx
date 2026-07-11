import { AdminPageHeader } from "@/components/admin/AdminShell";
import { BranchForm } from "@/components/admin/AdminForms";
import { requireSuperAdmin } from "@/lib/admin-auth";

export default async function NewBranchPage() {
  await requireSuperAdmin();
  return <><AdminPageHeader title="Tambah Cabang" /><BranchForm /></>;
}
