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
        {messages.map((item: AdminContactMessage) => <article key={item.id} className="rounded-[18px] bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold">{item.name}</p><p className="text-sm text-[#7a7a7a]">{item.email} {item.whatsapp}</p></div><StatusBadge>{item.isRead ? "Read" : "Unread"}</StatusBadge></div><p className="mt-3 font-medium">{item.subject}</p><p className="mt-2 text-sm leading-6">{item.message}</p><form action={updateContactRead.bind(null, item.id, !item.isRead)} className="mt-4"><button className="rounded-full bg-[#0066cc] px-4 py-2 text-white">{item.isRead ? "Mark Unread" : "Mark Read"}</button></form></article>)}
      </div>
    </div>
  );
}
