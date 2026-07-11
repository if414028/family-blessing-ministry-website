import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/data";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <Image
                src={settings.logoUrl}
                alt={`${settings.siteName} logo`}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-contain"
              />
            ) : null}
            <p className="text-xl font-semibold">{settings.siteName}</p>
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#7a7a7a]">
            {settings.description}
          </p>
        </div>
        <div>
          <p className="font-semibold">Quick Links</p>
          <div className="mt-3 grid gap-2 text-sm text-[#333333]">
            <Link href="/tentang-kami">Tentang Kami</Link>
            <Link href="/cabang">Cabang</Link>
            <Link href="/khotbah">Khotbah</Link>
            <Link href="/doa">Pokok Doa</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Kontak</p>
          <p className="mt-3 text-sm leading-6 text-[#7a7a7a]">
            Untuk informasi jadwal dan pelayanan, hubungi contact person cabang terdekat.
          </p>
        </div>
      </div>
      <div className="border-t border-[#e0e0e0] px-5 py-5 text-center text-xs text-[#7a7a7a]">
        Copyright {new Date().getFullYear()} Family Blessing. All rights reserved.
      </div>
    </footer>
  );
}
