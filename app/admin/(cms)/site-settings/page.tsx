import { AdminPageHeader } from "@/components/admin/AdminShell";
import { SiteSettingsForm } from "@/components/admin/AdminForms";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SiteSettingsPage() {
  await requireSuperAdmin();
  const settings = await getSiteSettings();
  return <><AdminPageHeader title="Site Settings" description="Brand, kontak, sosial media, dan SEO default." /><SiteSettingsForm settings={settings} /></>;
}
