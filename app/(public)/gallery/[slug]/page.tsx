import type { Metadata } from "next";
import type { GalleryImage } from "@prisma/client";
import { notFound } from "next/navigation";
import { getAlbumBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const album = await getAlbumBySlug((await params).slug);
  return { title: album?.title ?? "Gallery", description: album?.description };
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const album = await getAlbumBySlug((await params).slug);
  if (!album) notFound();
  return (
    <main>
      <section className="bg-black px-5 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-[#2997ff]">{formatDate(album.date)}</p>
          <h1 className="mt-3 text-5xl font-semibold">{album.title}</h1>
          <p className="mt-4 text-white/75">{album.description}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-3">
        {album.images.length ? album.images.map((image: GalleryImage) => (
          <figure key={image.id} className="overflow-hidden rounded-[18px] bg-[#f5f5f7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="aspect-[4/3] w-full object-cover" src={image.imageUrl} alt={image.caption ?? album.title} />
            {image.caption ? <figcaption className="p-4 text-sm text-[#7a7a7a]">{image.caption}</figcaption> : null}
          </figure>
        )) : <p className="text-[#7a7a7a]">Belum ada foto dalam album ini.</p>}
      </section>
    </main>
  );
}
