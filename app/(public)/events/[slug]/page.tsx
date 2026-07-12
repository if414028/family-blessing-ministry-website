import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main>
      <section className="relative isolate overflow-hidden bg-black px-5 py-20 text-white">
        {event.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" src={event.coverImage} alt="" aria-hidden="true" />
            <div className="absolute inset-0 -z-10 bg-black/60" />
          </>
        ) : null}
        <div className="mx-auto max-w-4xl">
          <p className="text-[#2997ff]">{formatDate(event.startDate)}</p>
          <h1 className="mt-3 text-5xl font-semibold">{event.title}</h1>
          <p className="mt-5 text-white/75">{event.location}</p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-16">
        <p className="text-lg leading-8 text-[#333333]">{event.description}</p>
        {event.registrationLink ? <Link className="mt-8 inline-flex rounded-full bg-[#0066cc] px-6 py-3 text-white" href={event.registrationLink}>Daftar Event</Link> : null}
      </section>
    </main>
  );
}
