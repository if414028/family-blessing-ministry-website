import type { Prisma } from "@prisma/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireSuperAdmin();
  type AdminMediaFile = Prisma.MediaFileGetPayload<object>;
  const files: AdminMediaFile[] = await prisma.mediaFile.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Media Library" description="Upload abstraction awal memakai public/uploads; model MediaFile sudah disiapkan untuk diganti storage lain nanti." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{files.length ? files.map((file: AdminMediaFile) => <div key={file.id} className="admin-card transition hover:border-[#c7c7cc]"><p className="truncate font-semibold">{file.fileName}</p><p className="mt-2 text-sm text-[#6e6e73]">{file.mimeType} · {file.size.toLocaleString("id-ID")} bytes</p></div>) : <div className="admin-card admin-empty md:col-span-2 xl:col-span-3">Belum ada media yang tersimpan.</div>}</div>
    </div>
  );
}
