import { notFound, redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { EventForm } from "@/components/admin/AdminForms";
import { isSuperAdmin, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, user] = await Promise.all([params, requireCurrentUser()]);
  const [event, branches] = await Promise.all([
    prisma.event.findUnique({ where: { id } }),
    prisma.branch.findMany({
      where: isSuperAdmin(user) ? {} : { id: user.branchId ?? "__no_branch__" },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!event) notFound();
  if (!isSuperAdmin(user) && event.branchId !== user.branchId) redirect("/admin/events");
  return <><AdminPageHeader title={`Edit ${event.title}`} /><EventForm event={event} branches={branches} /></>;
}
