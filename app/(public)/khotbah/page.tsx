import type { Metadata } from "next";
import { SermonCard } from "@/components/public/Cards";
import { SectionHeading } from "@/components/public/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedSermons } from "@/lib/data";

export const metadata: Metadata = { title: "Khotbah", description: "Video khotbah, renungan, dan pelayanan firman Family Blessing." };
export const dynamic = "force-dynamic";

export default async function SermonsPage() {
  const sermons = await getPublishedSermons();
  return (
    <main className="bg-[#f5f5f7] px-5 py-20">
      <SectionHeading eyebrow="Khotbah" title="Renungan dan Video Khotbah" />
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-3">
        {sermons.length ? sermons.map((sermon) => <SermonCard key={sermon.id} sermon={sermon} />) : <div className="md:col-span-3"><EmptyState title="Belum ada khotbah terpublikasi" description="Video khotbah akan tampil setelah ditambahkan dari CMS." /></div>}
      </div>
    </main>
  );
}
