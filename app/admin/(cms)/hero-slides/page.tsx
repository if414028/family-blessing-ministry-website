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
      <div className="overflow-hidden rounded-[18px] bg-white">{slides.map((slide: AdminHeroSlide) => <div key={slide.id} className="grid gap-3 border-b border-[#e0e0e0] p-4 md:grid-cols-[1fr_130px]"><div><p className="font-semibold">{slide.title}</p><p className="text-sm text-[#7a7a7a]">{slide.subtitle}</p></div><StatusBadge>{slide.status}</StatusBadge></div>)}</div>
    </div>
  );
}
