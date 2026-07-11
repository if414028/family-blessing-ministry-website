import { notFound, redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AlbumForm } from "@/components/admin/AdminForms";
import { isSuperAdmin, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, user] = await Promise.all([params, requireCurrentUser()]);
  const [album, branches] = await Promise.all([
    prisma.galleryAlbum.findUnique({ where: { id }, include: { images: true } }),
    prisma.branch.findMany({
      where: isSuperAdmin(user) ? {} : { id: user.branchId ?? "__no_branch__" },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!album) notFound();
  if (!isSuperAdmin(user) && album.branchId !== user.branchId) redirect("/admin/gallery");
  return <><AdminPageHeader title={`Edit ${album.title}`} description="Image list model sudah tersedia; upload library dapat ditukar ke storage abstraction nanti." /><AlbumForm album={album} branches={branches} /></>;
}
