import type { Prisma } from "@prisma/client";
import { Building2, CalendarCheck2, Mail, MessageCircleHeart, PlaySquare } from "lucide-react";
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
      <AdminPageHeader title="Dashboard" description={`Selamat datang, ${user.name}. Berikut ringkasan pelayanan dan konten website saat ini.`} />
      <div className={`grid gap-4 sm:grid-cols-2 ${stats.length === 5 ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}>
        {stats.map(([label, value]: DashboardStat) => (
          <div key={label} className="admin-card group min-h-40">
            <div className="flex items-start justify-between gap-4">
              <p className="max-w-28 text-sm font-medium leading-5 text-[#6e6e73]">{label}</p>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e9f2ff] text-[#0066cc]">
                <DashboardIcon label={label} />
              </span>
            </div>
            <p className="mt-6 text-[40px] font-semibold leading-none tracking-[-0.04em]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="admin-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">Pelayanan</p>
              <h2 className="mt-2 text-lg font-semibold">Pokok Doa Terbaru</h2>
            </div>
            <MessageCircleHeart className="h-5 w-5 text-[#7a7a7a]" aria-hidden="true" />
          </div>
          <div className="mt-5 divide-y divide-[#e8e8ed]">
            {recentPrayers.length ? recentPrayers.map((item: RecentPrayerRequest) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6e6e73]">{item.request}</p>
              </div>
            )) : <p className="py-7 text-center text-sm text-[#7a7a7a]">Belum ada pokok doa terbaru.</p>}
          </div>
        </section>
        {isSuperAdmin(user) ? (
          <section className="admin-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">Inbox</p>
                <h2 className="mt-2 text-lg font-semibold">Pesan Kontak Terbaru</h2>
              </div>
              <Mail className="h-5 w-5 text-[#7a7a7a]" aria-hidden="true" />
            </div>
            <div className="mt-5 divide-y divide-[#e8e8ed]">
              {recentContacts.length ? recentContacts.map((item: RecentContactMessage) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6e6e73]">{item.message}</p>
                </div>
              )) : <p className="py-7 text-center text-sm text-[#7a7a7a]">Belum ada pesan kontak terbaru.</p>}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function DashboardIcon({ label }: { label: string }) {
  const className = "h-5 w-5";
  if (label === "Total Cabang") return <Building2 className={className} aria-hidden="true" />;
  if (label === "Event Published") return <CalendarCheck2 className={className} aria-hidden="true" />;
  if (label === "Sermon Published") return <PlaySquare className={className} aria-hidden="true" />;
  if (label === "Contact Unread") return <Mail className={className} aria-hidden="true" />;
  return <MessageCircleHeart className={className} aria-hidden="true" />;
}
