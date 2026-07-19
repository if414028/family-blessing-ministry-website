import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminShell";
import { branchScopedWhere, requireCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const user = await requireCurrentUser();
  type AdminAlbum = Prisma.GalleryAlbumGetPayload<{ include: { branch: true } }>;
  const albums: AdminAlbum[] = await prisma.galleryAlbum.findMany({ where: branchScopedWhere(user), include: { branch: true }, orderBy: { date: "desc" } }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Gallery" action={<Link className="rounded-full bg-[#0066cc] px-5 py-2.5 text-white" href="/admin/gallery/new">Tambah Album</Link>} />
      <div className="admin-list">{albums.length ? albums.map((album: AdminAlbum) => <div key={album.id} className="admin-list-row grid items-center gap-3 border-b border-[#e8e8ed] p-4 last:border-0 md:grid-cols-[1fr_150px_130px_90px] md:px-5"><div><p className="font-semibold">{album.title}</p><p className="mt-1 text-sm text-[#6e6e73]">{album.branch?.name ?? "General"}</p></div><span className="text-sm text-[#333333]">{formatDate(album.date)}</span><StatusBadge>{album.status}</StatusBadge><Link className="admin-text-link" href={`/admin/gallery/${album.id}/edit`}>Edit</Link></div>) : <div className="admin-empty">Belum ada album galeri.</div>}</div>
    </div>
  );
}
