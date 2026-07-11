import Link from "next/link";
import { CalendarDays, MapPin, PlayCircle } from "lucide-react";
import type { BranchLike } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { WhatsAppButton, YouTubeButton } from "@/components/public/ActionButtons";

export function BranchCard({ branch }: { branch: BranchLike }) {
  return (
    <article className="rounded-[18px] border border-[#e0e0e0] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#0066cc]">{branch.type === "ZOOM" ? "Online" : branch.city}</p>
          <h3 className="mt-2 text-xl font-semibold text-[#1d1d1f]">{branch.name}</h3>
        </div>
        <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-xs">{branch.type}</span>
      </div>
      <p className="mt-4 flex gap-2 text-sm leading-6 text-[#7a7a7a]">
        <MapPin className="mt-1 h-4 w-4 shrink-0" /> {branch.venueName ? `${branch.venueName}, ` : ""}
        {branch.address}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link className="rounded-full bg-[#1d1d1f] px-4 py-2 text-sm text-white" href={`/cabang/${branch.slug}`}>
          Detail
        </Link>
        <WhatsAppButton phone={branch.whatsappPhone} />
        <YouTubeButton href={branch.youtubeUrl ?? undefined} label={branch.youtubeChannelName ?? "YouTube"} />
      </div>
    </article>
  );
}

export function EventCard({ event }: { event: { title: string; slug: string; startDate: Date; location?: string | null; description: string } }) {
  return (
    <article className="rounded-[18px] bg-white p-6">
      <p className="flex items-center gap-2 text-sm text-[#0066cc]">
        <CalendarDays size={16} /> {formatDate(event.startDate)}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-[#1d1d1f]">{event.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#7a7a7a]">{event.description}</p>
      <Link className="mt-5 inline-flex text-sm font-medium text-[#0066cc]" href={`/events/${event.slug}`}>
        Lihat detail
      </Link>
    </article>
  );
}

export function SermonCard({ sermon }: { sermon: { title: string; slug: string; speaker: string; date: Date; description: string } }) {
  return (
    <article className="rounded-[18px] border border-[#e0e0e0] bg-white p-6">
      <p className="flex items-center gap-2 text-sm text-[#0066cc]">
        <PlayCircle size={16} /> {formatDate(sermon.date)}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-[#1d1d1f]">{sermon.title}</h3>
      <p className="mt-1 text-sm font-medium text-[#333333]">{sermon.speaker}</p>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#7a7a7a]">{sermon.description}</p>
      <Link className="mt-5 inline-flex text-sm font-medium text-[#0066cc]" href={`/khotbah/${sermon.slug}`}>
        Tonton khotbah
      </Link>
    </article>
  );
}

export function GalleryCard({ album }: { album: { title: string; slug: string; description: string; date: Date; coverImage?: string | null } }) {
  return (
    <article className="overflow-hidden rounded-[18px] border border-[#e0e0e0] bg-white">
      <div className="aspect-[16/10] bg-[#f5f5f7]" style={album.coverImage ? { backgroundImage: `url(${album.coverImage})`, backgroundSize: "cover" } : undefined} />
      <div className="p-6">
        <p className="text-sm text-[#0066cc]">{formatDate(album.date)}</p>
        <h3 className="mt-2 text-xl font-semibold text-[#1d1d1f]">{album.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#7a7a7a]">{album.description}</p>
        <Link className="mt-5 inline-flex text-sm font-medium text-[#0066cc]" href={`/gallery/${album.slug}`}>
          Lihat album
        </Link>
      </div>
    </article>
  );
}
