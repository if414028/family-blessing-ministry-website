import type { Metadata } from "next";
import { PrayerRequestForm } from "@/components/public/PublicForms";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getBranches, getPageContent, type BranchLike } from "@/lib/data";

export const metadata: Metadata = { title: "Pokok Doa", description: "Kirim pokok doa kepada tim pelayanan Family Blessing." };
export const dynamic = "force-dynamic";

export default async function PrayerPage() {
  const branches: BranchLike[] = await getBranches();
  const intro = await getPageContent("prayer_intro");
  return (
    <main className="bg-[#f5f5f7] px-5 py-20">
      <SectionHeading eyebrow="Doa" title={intro?.title ?? "Kirim Pokok Doa"} description={intro?.content} />
      <div className="mx-auto mt-10 max-w-2xl"><PrayerRequestForm branches={branches} /></div>
    </main>
  );
}
