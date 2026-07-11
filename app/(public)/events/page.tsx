import type { Metadata } from "next";
import { EventCard } from "@/components/public/Cards";
import { SectionHeading } from "@/components/public/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedEvents } from "@/lib/data";

export const metadata: Metadata = { title: "Events", description: "Agenda dan event Family Blessing." };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getPublishedEvents();
  const now = new Date();
  const upcoming = events.filter((event) => event.startDate >= now);
  const past = events.filter((event) => event.startDate < now);
  return (
    <main className="bg-[#f5f5f7] px-5 py-20">
      <SectionHeading eyebrow="Events" title="Agenda Family Blessing" />
      <div className="mx-auto mt-10 max-w-7xl">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {upcoming.length ? upcoming.map((event) => <EventCard key={event.id} event={event} />) : <div className="md:col-span-3"><EmptyState title="Belum ada upcoming event" description="Event terpublikasi akan tampil di area ini." /></div>}
        </div>
        <h2 className="mt-12 text-2xl font-semibold">Past Events</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {past.length ? past.map((event) => <EventCard key={event.id} event={event} />) : <div className="md:col-span-3"><EmptyState title="Belum ada past event" description="Arsip event akan tampil setelah tersedia." /></div>}
        </div>
      </div>
    </main>
  );
}
