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
        {requests.map((item: AdminPrayerRequest) => <article key={item.id} className="rounded-[18px] bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold">{item.name}</p><p className="text-sm text-[#7a7a7a]">{item.whatsapp} {item.email ? `- ${item.email}` : ""}</p></div><StatusBadge>{item.status}</StatusBadge></div><p className="mt-4 text-sm leading-6">{item.request}</p><form action={updatePrayerStatus.bind(null, item.id)} className="mt-4 grid gap-3 md:grid-cols-[180px_1fr_120px]"><select className="admin-field" name="status" defaultValue={item.status}><option>NEW</option><option>PRAYED</option><option>CONTACTED</option><option>ARCHIVED</option></select><input className="admin-field" name="internalNote" defaultValue={item.internalNote ?? ""} placeholder="Internal note" /><button className="rounded-full bg-[#0066cc] px-4 py-2 text-white">Update</button></form></article>)}
      </div>
    </div>
  );
}
