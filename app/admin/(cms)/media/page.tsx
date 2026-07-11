import { AdminPageHeader } from "@/components/admin/AdminShell";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireSuperAdmin();
  const files = await prisma.mediaFile.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Media Library" description="Upload abstraction awal memakai public/uploads; model MediaFile sudah disiapkan untuk diganti storage lain nanti." />
      <div className="grid gap-4 md:grid-cols-3">{files.map((file) => <div key={file.id} className="rounded-[18px] bg-white p-4"><p className="font-semibold">{file.fileName}</p><p className="text-sm text-[#7a7a7a]">{file.mimeType} - {file.size} bytes</p></div>)}</div>
    </div>
  );
}
