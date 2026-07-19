import type { Prisma } from "@prisma/client";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminShell";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HeroSlidesPage() {
  await requireSuperAdmin();
  type AdminHeroSlide = Prisma.HeroSlideGetPayload<object>;
  const slides: AdminHeroSlide[] = await prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []);
  return (
    <div>
      <AdminPageHeader title="Hero Slides" description="Model hero slide sudah siap; homepage memakai fallback hero jika belum ada slide published." />
      <div className="admin-list">{slides.length ? slides.map((slide: AdminHeroSlide) => <div key={slide.id} className="admin-list-row grid items-center gap-3 border-b border-[#e8e8ed] p-4 last:border-0 md:grid-cols-[1fr_130px] md:px-5"><div><p className="font-semibold">{slide.title}</p><p className="mt-1 text-sm text-[#6e6e73]">{slide.subtitle}</p></div><StatusBadge>{slide.status}</StatusBadge></div>) : <div className="admin-empty">Belum ada hero slide.</div>}</div>
    </div>
  );
}
