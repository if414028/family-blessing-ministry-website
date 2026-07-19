import type { Prisma } from "@prisma/client";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminShell";
import { updatePrayerStatus } from "@/lib/actions";
import { branchScopedWhere, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PrayerRequestsAdminPage() {
  const user = await requireCurrentUser();
  type AdminPrayerRequest = Prisma.PrayerRequestGetPayload<{ include: { branch: true } }>;
  const requests: AdminPrayerRequest[] = await prisma.prayerRequest.findMany({ where: branchScopedWhere(user), include: { branch: true }, orderBy: { createdAt: "desc" } }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Prayer Requests" description="Data privat. Hanya tampil di CMS admin." />
      <div className="grid gap-4">
        {requests.length ? requests.map((item: AdminPrayerRequest) => <article key={item.id} className="admin-card"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold">{item.name}</p><p className="mt-1 text-sm text-[#6e6e73]">{item.whatsapp} {item.email ? `- ${item.email}` : ""}</p></div><StatusBadge>{item.status}</StatusBadge></div><p className="mt-4 max-w-4xl text-sm leading-6">{item.request}</p><form action={updatePrayerStatus.bind(null, item.id)} className="mt-5 grid gap-3 border-t border-[#e8e8ed] pt-5 md:grid-cols-[180px_1fr_120px]"><select className="admin-field" name="status" defaultValue={item.status}><option>NEW</option><option>PRAYED</option><option>CONTACTED</option><option>ARCHIVED</option></select><input className="admin-field" name="internalNote" defaultValue={item.internalNote ?? ""} placeholder="Internal note" /><button className="admin-primary-button">Update</button></form></article>) : <div className="admin-card admin-empty">Belum ada pokok doa yang masuk.</div>}
      </div>
    </div>
  );
}
