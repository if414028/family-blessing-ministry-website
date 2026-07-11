import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/data";

const navItems = [
  ["Home", "/"],
  ["Tentang Kami", "/tentang-kami"],
  ["Cabang", "/cabang"],
  ["Jadwal", "/events"],
  ["Khotbah", "/khotbah"],
  ["Events", "/events"],
  ["Gallery", "/gallery"],
  ["Doa", "/doa"],
  ["Kontak", "/kontak"],
];

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={`${settings.siteName} logo`}
              width={42}
              height={42}
              className="h-10 w-10 rounded-full object-contain"
              priority
            />
          ) : null}
          <span>{settings.siteName}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-xs text-white/80 lg:flex">
          {navItems.map(([label, href]) => (
            <Link key={href + label} className="transition hover:text-white" href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <Link className="rounded-full bg-[#0066cc] px-4 py-2 text-sm font-medium text-white" href="/admin/login">
          Login
        </Link>
      </div>
    </header>
  );
}
