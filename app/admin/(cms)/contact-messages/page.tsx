import type { Prisma } from "@prisma/client";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminShell";
import { updateContactRead } from "@/lib/actions";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContactMessagesAdminPage() {
  await requireSuperAdmin();
  type AdminContactMessage = Prisma.ContactMessageGetPayload<object>;
  const messages: AdminContactMessage[] = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Contact Messages" />
      <div className="grid gap-4">
        {messages.length ? messages.map((item: AdminContactMessage) => <article key={item.id} className="admin-card"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold">{item.name}</p><p className="mt-1 text-sm text-[#6e6e73]">{item.email} {item.whatsapp}</p></div><StatusBadge>{item.isRead ? "Read" : "Unread"}</StatusBadge></div><p className="mt-4 font-semibold">{item.subject}</p><p className="mt-2 max-w-4xl text-sm leading-6">{item.message}</p><form action={updateContactRead.bind(null, item.id, !item.isRead)} className="mt-5 border-t border-[#e8e8ed] pt-5"><button className="admin-primary-button">{item.isRead ? "Mark Unread" : "Mark Read"}</button></form></article>) : <div className="admin-card admin-empty">Belum ada pesan kontak.</div>}
      </div>
    </div>
  );
}
