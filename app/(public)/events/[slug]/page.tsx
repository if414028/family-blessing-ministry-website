import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, PlayCircle } from "lucide-react";
import { getEventBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const event = await getEventBySlug((await params).slug);
  return { title: event?.title ?? "Event", description: event?.description };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEventBySlug((await params).slug);
  if (!event) notFound();
  return (
    <main className="bg-[#f5f5f7] px-5 py-10 md:py-16">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-start">
        <div className="overflow-hidden rounded-[18px] bg-white shadow-sm ring-1 ring-black/5">
          {event.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="aspect-[4/5] w-full object-cover" src={event.coverImage} alt={`Cover event ${event.title}`} />
          ) : (
            <div className="grid aspect-[4/5] place-items-center bg-[#1d1d1f] p-8 text-center text-white/70">Cover event belum tersedia.</div>
          )}
        </div>

        <article className="rounded-[18px] bg-white p-7 shadow-sm ring-1 ring-black/5 md:p-10">
          <p className="text-sm font-semibold text-[#0066cc]">EVENT FAMILY BLESSING</p>
          <p className="mt-4 text-sm text-[#7a7a7a]">{formatDate(event.startDate)}{event.endDate ? ` - ${formatDate(event.endDate)}` : ""}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#1d1d1f] md:text-5xl">{event.title}</h1>

          {event.location ? <p className="mt-5 flex items-start gap-2 text-[#555555]"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0066cc]" />{event.location}</p> : null}

          <p className="mt-7 whitespace-pre-line text-base leading-8 text-[#555555]">{event.description}</p>

          {event.branch?.youtubeUrl ? (
            <div className="mt-8 border-t border-[#e0e0e0] pt-6">
              <p className="text-sm font-semibold text-[#1d1d1f]">Streaming untuk jemaat</p>
              <a className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#0066cc] hover:underline" href={event.branch.youtubeUrl} target="_blank" rel="noreferrer">
                <PlayCircle className="h-5 w-5" />
                Tonton live di YouTube {event.branch.youtubeChannelName ? `Family Blessing ${event.branch.youtubeChannelName}` : event.branch.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ) : null}

          {event.registrationLink ? <Link className="mt-8 inline-flex rounded-full bg-[#0066cc] px-6 py-3 text-white" href={event.registrationLink}>Daftar Event</Link> : null}
        </article>
      </section>
    </main>
  );
}
