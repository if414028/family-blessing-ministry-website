import type { Prisma } from "@prisma/client";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { branchScopedWhere, isSuperAdmin, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await requireCurrentUser();
  const scopedWhere = branchScopedWhere(user);
  type DashboardStat = readonly [string, number];
  type RecentPrayerRequest = Prisma.PrayerRequestGetPayload<object>;
  type RecentContactMessage = Prisma.ContactMessageGetPayload<object>;
  const branches = isSuperAdmin(user) ? await prisma.branch.count().catch(() => 0) : user.branchId ? 1 : 0;
  const events = await prisma.event.count({ where: { ...scopedWhere, status: "PUBLISHED" } }).catch(() => 0);
  const sermons = await prisma.sermon.count({ where: { ...scopedWhere, status: "PUBLISHED" } }).catch(() => 0);
  const prayers = await prisma.prayerRequest.count({ where: scopedWhere }).catch(() => 0);
  const unreadContacts = isSuperAdmin(user) ? await prisma.contactMessage.count({ where: { isRead: false } }).catch(() => 0) : 0;
  const recentPrayers: RecentPrayerRequest[] = await prisma.prayerRequest.findMany({ where: scopedWhere, take: 5, orderBy: { createdAt: "desc" } }).catch(() => []);
  const recentContacts: RecentContactMessage[] = isSuperAdmin(user) ? await prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: "desc" } }).catch(() => []) : [];
  const stats: DashboardStat[] = [
    ["Total Cabang", branches],
    ["Event Published", events],
    ["Sermon Published", sermons],
    ["Prayer Requests", prayers],
    ...(isSuperAdmin(user) ? ([["Contact Unread", unreadContacts]] satisfies DashboardStat[]) : []),
  ];
  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Ringkasan pelayanan dan konten website." />
      <div className="grid gap-4 md:grid-cols-5">{stats.map(([label, value]: DashboardStat) => <div key={label} className="rounded-[18px] bg-white p-5"><p className="text-sm text-[#7a7a7a]">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[18px] bg-white p-6"><h2 className="font-semibold">Recent Prayer Requests</h2><div className="mt-4 grid gap-3 text-sm">{recentPrayers.map((item: RecentPrayerRequest) => <p key={item.id}>{item.name}: {item.request.slice(0, 90)}</p>)}</div></section>
        {isSuperAdmin(user) ? <section className="rounded-[18px] bg-white p-6"><h2 className="font-semibold">Recent Contact Messages</h2><div className="mt-4 grid gap-3 text-sm">{recentContacts.map((item: RecentContactMessage) => <p key={item.id}>{item.name}: {item.message.slice(0, 90)}</p>)}</div></section> : null}
      </div>
    </div>
  );
}
