import Link from "next/link";
import Image from "next/image";
import { BranchCard, EventCard, SermonCard } from "@/components/public/Cards";
import { PrayerRequestForm } from "@/components/public/PublicForms";
import { SectionHeading } from "@/components/public/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getBranches,
  getPublishedEvents,
  getPublishedSermons,
  type BranchLike,
  type PublishedEvent,
  type PublishedSermon,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const branches: BranchLike[] = await getBranches();
  const events: PublishedEvent[] = await getPublishedEvents();
  const sermons: PublishedSermon[] = await getPublishedSermons();
  const previewBranches = branches.slice(0, 6);

  return (
    <main>
      <section className="relative isolate flex min-h-[calc(100vh-66px)] items-center overflow-hidden bg-black text-white">
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
          src="/uploads/family-blessing-vision-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,102,204,0.18),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.64),rgba(0,0,0,0.86))]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black to-transparent" />

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-24 text-center">
          <h1 className="hero-script max-w-7xl text-7xl font-normal leading-[0.86] tracking-normal md:text-[168px]">
            Family Blessing
          </h1>
          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.28em] text-[#2997ff]">2 Samuel 6 : 11</p>
          <p className="mt-4 max-w-4xl text-xl leading-8 text-white/82 md:text-2xl md:leading-9">
            Tiga bulan lamanya tabut Tuhan itu tinggal di rumah Obed-Edom, orang Gat itu,
            dan TUHAN memberkati Obed-Edom dan seisi rumahnya.
          </p>
        </div>
      </section>

      <section className="overflow-hidden bg-[#0066cc] py-4 text-white">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {Array.from({ length: 6 }).map((_: unknown, index: number) => (
            <p key={index} className="text-sm font-semibold uppercase tracking-[0.24em] text-white/85 md:text-base">
              2 Samuel 6 : 11 · Tiga bulan lamanya tabut Tuhan itu tinggal di rumah Obed-Edom,
              orang Gat itu, dan TUHAN memberkati Obed-Edom dan seisi rumahnya.
            </p>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl overflow-hidden bg-[#004b97] text-white md:min-h-[620px] md:grid-cols-[0.9fr_1.25fr]">
          <div className="relative min-h-[420px] overflow-hidden bg-black md:min-h-full">
            <div className="absolute -right-24 top-0 h-full w-48 rounded-r-full bg-[#004b97]" />
            <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[#0066cc]" />
            <div className="absolute inset-x-0 top-0 h-[62%] rounded-br-[180px] bg-black md:rounded-br-[260px]" />
            <Image
              src="/uploads/ev-yeremia-chemby.webp"
              alt="Ev. Yeremia Chemby"
              width={430}
              height={520}
              className="absolute bottom-0 left-1/2 z-10 h-[390px] w-auto -translate-x-1/2 object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.38)] md:h-[560px]"
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/82">Penasihat Family Blessing</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
              Ev. Yeremia Chemby
            </h2>
            <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-white/88 md:text-lg">
              <p>
                Pelayanan ini diarahkan dengan hati untuk membangun kehidupan doa,
                penyembahan, dan pengenalan akan firman Tuhan.
              </p>
              <p>
                Family Blessing rindu melihat setiap keluarga mengalami hadirat Tuhan,
                dipulihkan, bertumbuh dalam iman, dan menjadi berkat bagi banyak orang.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="rounded-full bg-white px-6 py-3 font-medium text-[#004b97]" href="/tentang-kami">
                Lihat Selengkapnya
              </Link>
              <Link className="rounded-full border border-white/55 px-6 py-3 font-medium text-white transition hover:bg-white/10" href="/doa">
                Kirim Pokok Doa
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-5 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold text-[#0066cc]">Cabang</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#1d1d1f] md:text-5xl">
            Family Blessing di Berbagai Negara
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[#7a7a7a]">
            Temukan persekutuan onsite dan online yang paling dekat dengan Anda.
          </p>
          <WorldMapIllustration />
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {previewBranches.map((branch: BranchLike) => (
            <BranchCard key={branch.slug} branch={branch} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link className="rounded-full bg-[#1d1d1f] px-6 py-3 text-white" href="/cabang">
            Lihat Semua Cabang
          </Link>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl rounded-[18px] bg-black p-8 text-white md:p-12">
          <p className="text-sm font-semibold text-[#2997ff]">Live Streaming</p>
          <h2 className="mt-3 text-4xl font-semibold">Ibadah Online & Live Streaming</h2>
          <p className="mt-4 max-w-2xl text-white/75">
            Ikuti channel YouTube cabang Family Blessing untuk ibadah online, renungan, dan pelayanan firman.
          </p>
          <Link className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-[#0066cc]" href="/khotbah">
            Tonton di YouTube
          </Link>
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-5 py-20">
        <SectionHeading eyebrow="Events" title="Agenda Mendatang" />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-3">
          {events.length ? events.slice(0, 3).map((event: PublishedEvent) => <EventCard key={event.id} event={event} />) : (
            <div className="md:col-span-3"><EmptyState title="Belum ada event terpublikasi" description="Agenda pelayanan akan tampil di sini ketika sudah dipublikasikan dari CMS." /></div>
          )}
        </div>
      </section>

      <section className="px-5 py-20">
        <SectionHeading eyebrow="Khotbah" title="Renungan dan Video Terbaru" />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-3">
          {sermons.length ? sermons.slice(0, 3).map((sermon: PublishedSermon) => <SermonCard key={sermon.id} sermon={sermon} />) : (
            <div className="md:col-span-3"><EmptyState title="Belum ada video khotbah" description="Video dan renungan terbaru akan tampil setelah dipublikasikan dari CMS." /></div>
          )}
        </div>
      </section>

      <section className="grid bg-[#f5f5f7] md:grid-cols-2">
        <div className="px-5 py-20 md:px-12 lg:px-20">
          <p className="text-sm font-semibold text-[#0066cc]">Persembahan</p>
          <h2 className="mt-3 text-4xl font-semibold">Persembahan & Dukungan Pelayanan</h2>
          <p className="mt-4 max-w-xl text-[#7a7a7a]">
            Setiap dukungan menjadi bagian dari pelayanan doa, penyembahan, dan penguatan keluarga.
          </p>
          <Link className="mt-7 inline-flex rounded-full bg-[#0066cc] px-6 py-3 text-white" href="/cabang">
            Lihat Rekening Cabang
          </Link>
        </div>
        <div className="px-5 py-20 md:px-12 lg:px-20">
          <PrayerRequestForm branches={branches} />
        </div>
      </section>
    </main>
  );
}

function WorldMapIllustration() {
  return (
    <div className="relative mx-auto mt-10 max-w-5xl">
      <Image
        src="/uploads/family-blessing-world-map-source.png"
        alt="Peta dunia Family Blessing"
        width={2048}
        height={847}
        className="h-auto w-full"
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 2048 847"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="family-blessing-highlight-countries">
            <polygon points="1542,426 1598,424 1627,456 1615,491 1564,484 1530,456" />
            <polygon points="1698,488 1770,474 1825,505 1790,560 1712,548 1678,518" />
            <polygon points="1584,512 1655,548 1642,610 1576,582 1534,533" />
            <polygon points="1660,590 1778,601 1810,625 1694,632" />
            <polygon points="1748,538 1848,540 1880,592 1814,626 1748,596" />
            <polygon points="1818,580 1920,610 1936,646 1828,636" />
            <polygon points="1915,575 1997,575 2028,628 1942,636" />
            <polygon points="1810,176 1858,195 1842,268 1805,251" />
            <polygon points="1852,240 1898,263 1894,322 1840,303" />
            <polygon points="1774,291 1818,309 1806,340 1766,323" />
          </clipPath>
          <filter id="family-blessing-land-alpha">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -0.5 -0.5 -0.5 0 1.5"
            />
          </filter>
          <mask id="family-blessing-land-mask" maskUnits="userSpaceOnUse">
            <image
              href="/uploads/family-blessing-world-map-source.png"
              width="2048"
              height="847"
              clipPath="url(#family-blessing-highlight-countries)"
              filter="url(#family-blessing-land-alpha)"
            />
          </mask>
        </defs>
        <rect
          width="2048"
          height="847"
          fill="#16a34a"
          clipPath="url(#family-blessing-highlight-countries)"
          mask="url(#family-blessing-land-mask)"
        />
      </svg>
    </div>
  );
}
