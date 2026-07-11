import type { Metadata } from "next";
import { GalleryCard } from "@/components/public/Cards";
import { SectionHeading } from "@/components/public/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedAlbums, type PublishedAlbum } from "@/lib/data";

export const metadata: Metadata = { title: "Gallery", description: "Album foto pelayanan Family Blessing." };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const albums: PublishedAlbum[] = await getPublishedAlbums();
  return (
    <main className="bg-[#f5f5f7] px-5 py-20">
      <SectionHeading eyebrow="Gallery" title="Momen Pelayanan" />
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-3">
        {albums.length ? albums.map((album: PublishedAlbum) => <GalleryCard key={album.id} album={album} />) : <div className="md:col-span-3"><EmptyState title="Belum ada album gallery" description="Album pelayanan akan tampil setelah dipublikasikan dari CMS." /></div>}
      </div>
    </main>
  );
}
