import type { Metadata } from "next";
import { BranchCard } from "@/components/public/Cards";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getBranches } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cabang",
  description: "Daftar cabang Family Blessing onsite dan online.",
};

export const dynamic = "force-dynamic";

export default async function BranchesPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const params = await searchParams;
  const branches = await getBranches();
  const filtered = branches.filter((branch) => {
    const q = (params.q ?? "").toLowerCase();
    const type = params.type ?? "";
    return (!q || `${branch.name} ${branch.city} ${branch.country}`.toLowerCase().includes(q)) && (!type || branch.type === type || (type === "INTERNATIONAL" ? branch.country !== "Indonesia" : true));
  });

  return (
    <main className="bg-[#f5f5f7]">
      <section className="px-5 py-20">
        <SectionHeading eyebrow="Cabang" title="Temukan Family Blessing Terdekat" description="Cari berdasarkan kota, negara, atau tipe persekutuan." />
        <form className="mx-auto mt-8 flex max-w-3xl flex-wrap gap-3 rounded-[18px] bg-white p-3">
          <input className="form-field flex-1" name="q" defaultValue={params.q} placeholder="Cari kota atau nama cabang" />
          <select className="form-field w-full md:w-48" name="type" defaultValue={params.type}>
            <option value="">Semua</option>
            <option value="ONSITE">Onsite</option>
            <option value="ZOOM">Zoom</option>
            <option value="INTERNATIONAL">International</option>
          </select>
          <button className="rounded-full bg-[#0066cc] px-6 py-2.5 text-white">Cari</button>
        </form>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((branch) => <BranchCard key={branch.slug} branch={branch} />)}
      </section>
    </main>
  );
}
