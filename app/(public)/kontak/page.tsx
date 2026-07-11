import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/public/PublicForms";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getBranches, getSiteSettings, type BranchLike } from "@/lib/data";

export const metadata: Metadata = { title: "Kontak", description: "Hubungi Family Blessing dan temukan cabang terdekat." };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const branches: BranchLike[] = await getBranches();
  return (
    <main className="bg-[#f5f5f7] px-5 py-20">
      <SectionHeading eyebrow="Kontak" title="Kami Senang Terhubung dengan Anda" description="Kirim pesan umum atau pilih cabang terdekat untuk informasi jadwal dan pelayanan." />
      <section className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-[1fr_0.8fr]">
        <ContactForm />
        <aside className="rounded-[18px] bg-white p-6">
          <h2 className="text-2xl font-semibold">Informasi Umum</h2>
          <p className="mt-3 text-sm leading-6 text-[#7a7a7a]">{settings.description}</p>
          <div className="mt-6 grid gap-2 text-sm">
            {settings.primaryEmail ? <p>Email: {settings.primaryEmail}</p> : null}
            {settings.primaryPhone ? <p>Phone: {settings.primaryPhone}</p> : null}
          </div>
          <h3 className="mt-8 font-semibold">Cabang Ringkas</h3>
          <div className="mt-3 grid gap-2 text-sm text-[#333333]">
            {branches.slice(0, 6).map((branch: BranchLike) => <Link key={branch.slug} href={`/cabang/${branch.slug}`}>{branch.name}</Link>)}
          </div>
        </aside>
      </section>
    </main>
  );
}
