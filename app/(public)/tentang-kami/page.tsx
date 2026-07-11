import type { Metadata } from "next";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getPageContent, type PageContentLike } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Tentang Family Blessing, visi misi, nilai pelayanan, dan penggembalaan Ev. Yeremia Chemby.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getPageContent("about");
  const vision = await getPageContent("vision_mission");
  const pastor = await getPageContent("pastor_profile");
  const sections: Array<PageContentLike | undefined> = [about, vision, pastor];

  return (
    <main>
      <section className="bg-black px-5 py-24 text-white">
        <SectionHeading eyebrow="Tentang Kami" title="Family Blessing" description="Sebuah keluarga rohani yang bertumbuh dalam doa, penyembahan, firman, dan persekutuan." />
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 md:grid-cols-3">
        {sections.map((item: PageContentLike | undefined) => (
          <article key={item?.slug} className="rounded-[18px] bg-[#f5f5f7] p-7">
            <h2 className="text-2xl font-semibold">{item?.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[#7a7a7a]">{item?.content}</p>
          </article>
        ))}
      </section>
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl rounded-[18px] bg-black p-10 text-white">
          <h2 className="text-4xl font-semibold">Kami percaya setiap keluarga dapat menjadi berkat</h2>
          <p className="mt-4 max-w-2xl text-white/75">
            Melalui doa, penyembahan, dan persekutuan yang sehat, keluarga dapat dipulihkan,
            dikuatkan, dan dipakai Tuhan bagi banyak orang.
          </p>
        </div>
      </section>
    </main>
  );
}
