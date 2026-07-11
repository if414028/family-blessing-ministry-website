import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PageContentForm } from "@/components/admin/AdminForms";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { defaultPages } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  await requireSuperAdmin();
  const pages = await prisma.pageContent.findMany({ orderBy: { slug: "asc" } }).catch(() => []);
  const merged = pages.length ? pages : defaultPages;
  return (
    <div>
      <AdminPageHeader title="Pages" description="Editor konten sederhana untuk about, vision_mission, pastor_profile, giving_intro, dan prayer_intro." />
      <div className="grid gap-5 lg:grid-cols-2">
        {merged.map((page) => <PageContentForm key={page.slug} page={page} />)}
      </div>
    </div>
  );
}
