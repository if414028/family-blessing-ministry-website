import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyButton, WhatsAppButton, YouTubeButton } from "@/components/public/ActionButtons";
import { BranchCard } from "@/components/public/Cards";
import { getBranchBySlug, getBranches, type BranchLike } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);
  return { title: branch?.name ?? "Cabang", description: branch?.address };
}

export default async function BranchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);
  const branches: BranchLike[] = await getBranches();
  if (!branch) notFound();
  const others = branches.filter((item: BranchLike) => item.slug !== branch.slug).slice(0, 3);

  return (
    <main>
      <section className="bg-black px-5 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-[#2997ff]">{branch.type === "ZOOM" ? "Online via Zoom" : branch.city}</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight">{branch.name}</h1>
          <p className="mt-5 max-w-2xl text-white/75">{branch.address}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <WhatsAppButton phone={branch.whatsappPhone} label="Hubungi via WhatsApp" />
            <YouTubeButton href={branch.youtubeUrl ?? undefined} label={branch.youtubeChannelName ?? "YouTube"} />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[18px] bg-[#f5f5f7] p-8">
          <h2 className="text-3xl font-semibold">Informasi Cabang</h2>
          <dl className="mt-6 grid gap-4 text-sm">
            <div><dt className="font-semibold">Venue</dt><dd className="mt-1 text-[#7a7a7a]">{branch.venueName ?? "-"}</dd></div>
            <div><dt className="font-semibold">Alamat</dt><dd className="mt-1 text-[#7a7a7a]">{branch.address}</dd></div>
            <div><dt className="font-semibold">Contact Person</dt><dd className="mt-1 text-[#7a7a7a]">{branch.contactPersonName} {branch.contactPersonPhone ? `(${branch.contactPersonPhone})` : ""}</dd></div>
            {branch.zoomInfo ? <div><dt className="font-semibold">Zoom</dt><dd className="mt-1 text-[#7a7a7a]">{branch.zoomInfo}</dd></div> : null}
          </dl>
        </div>
        <div className="rounded-[18px] border border-[#e0e0e0] p-8">
          <h2 className="text-2xl font-semibold">Rekening Persembahan</h2>
          {branch.bankAccountNumber ? (
            <div className="mt-5 space-y-3 text-sm">
              <p><span className="font-semibold">Bank:</span> {branch.bankName}</p>
              <p><span className="font-semibold">Nomor:</span> {branch.bankAccountNumber}</p>
              <p><span className="font-semibold">Atas nama:</span> {branch.bankAccountHolder}</p>
              <CopyButton value={branch.bankAccountNumber} label="Copy nomor rekening" />
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#7a7a7a]">Informasi rekening belum tersedia untuk cabang ini.</p>
          )}
        </div>
      </section>
      <section className="bg-[#f5f5f7] px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold">Cabang Lainnya</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {others.map((item: BranchLike) => <BranchCard key={item.slug} branch={item} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
