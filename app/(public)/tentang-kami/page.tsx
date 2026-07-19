import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Tentang Family Blessing Ministry, visi dan misi, serta pelayanan profetik.",
};

export default function AboutPage() {
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
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#2997ff]">
            Tentang Kami
          </p>
          <h1 className="hero-script mt-8 max-w-7xl text-7xl font-normal leading-[0.86] tracking-normal md:text-[168px]">
            Family Blessing
          </h1>
          <p className="mt-10 max-w-4xl text-xl leading-8 text-white/82 md:text-2xl md:leading-9">
            Pelayanan yang bergerak secara Profetik untuk membangun manusia Roh.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 md:grid-cols-2">
        <article className="rounded-[18px] bg-[#f5f5f7] p-7">
          <h2 className="text-2xl font-semibold">Tentang Family Blessing Ministry</h2>
          <p className="mt-4 text-sm leading-7 text-[#7a7a7a]">
            Family Blessing Ministry adalah suatu persekutuan interdenominasi yg bergerak
            dalam bidang profetik sehingga sungguh kita berjalan dengan arahan Roh Kudus
          </p>
        </article>
        <article className="rounded-[18px] bg-[#f5f5f7] p-7">
          <h2 className="text-2xl font-semibold">Visi &amp; Misi Family Blessing</h2>
          <p className="mt-4 text-sm leading-7 text-[#7a7a7a]">
            Tabut Allah tinggal di rumah Obed Edom selama 3 bulan lamanya dan sesuatu yg
            Ajaib terus terjadi di dalam rumah Obed Edom. Itu berbicara bagaiman kita
            menghormati dan memberlakukan Hadirat Tuhan dengan benar maka jaminan Tuhan
            terjadi bagimu, Hadirat Tuhan membuat kita Kuat. 
            Di dalam Nama Tuhan Yesus,
            Amin Amin Amin
          </p>
          <p className="mt-4 text-sm font-semibold text-black">— Ev Yeremia Cemby</p>
        </article>
      </section>
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl rounded-[18px] bg-black p-10 text-white">
          <h2 className="text-4xl font-semibold">
            Pelayanan yang bergerak secara Profetik untuk membangun manusia Roh
          </h2>
          <p className="mt-4 max-w-2xl text-white/75">
            Hadirat Tuhan yang terutama memimpin di setiap Kehidupan kita dan Tinggal dalam
            Hadirat Nya.
          </p>
        </div>
      </section>
    </main>
  );
}
