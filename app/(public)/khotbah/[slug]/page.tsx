import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSermonBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const sermon = await getSermonBySlug((await params).slug);
  return { title: sermon?.title ?? "Khotbah", description: sermon?.description };
}

export default async function SermonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const sermon = await getSermonBySlug((await params).slug);
  if (!sermon) notFound();
  return (
    <main>
      <section className="bg-black px-5 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-[#2997ff]">{formatDate(sermon.date)} oleh {sermon.speaker}</p>
          <h1 className="mt-3 text-5xl font-semibold">{sermon.title}</h1>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-16">
        {sermon.youtubeEmbedId ? (
          <iframe className="aspect-video w-full rounded-[18px]" src={`https://www.youtube.com/embed/${sermon.youtubeEmbedId}`} title={sermon.title} allowFullScreen />
        ) : null}
        {sermon.bibleVerse ? <p className="mt-6 font-semibold text-[#0066cc]">{sermon.bibleVerse}</p> : null}
        <p className="mt-5 text-lg leading-8 text-[#333333]">{sermon.description}</p>
      </section>
    </main>
  );
}
