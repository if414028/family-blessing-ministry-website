"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  CircleGauge,
  GalleryHorizontalEnd,
  Images,
  Mail,
  MapPinned,
  Menu,
  MessageCircleHeart,
  Settings,
  UsersRound,
  X,
} from "lucide-react";

export type AdminNavItem = readonly [string, string];

const icons = {
  Dashboard: CircleGauge,
  Branches: MapPinned,
  Events: CalendarDays,
  Sermons: MessageCircleHeart,
  Gallery: GalleryHorizontalEnd,
  "Prayer Requests": MessageCircleHeart,
  "Contact Messages": Mail,
  Users: UsersRound,
  "Media Library": Images,
  Pages: Settings,
  "Site Settings": Settings,
};

export function AdminNavigation({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navigation = (
    <>
      <div className="flex items-center gap-3 px-3">
        <Image
          src="/uploads/family-blessing-logo.png"
          alt="Family Blessing"
          width={44}
          height={44}
          className="h-11 w-11 object-contain"
        />
        <div className="min-w-0">
          <p className="truncate text-[17px] font-semibold tracking-[-0.01em] text-white">
            Family Blessing
          </p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
            Content Manager
          </p>
        </div>
      </div>
      <nav className="mt-9 grid gap-1" aria-label="Navigasi CMS">
        {items.map(([label, href]) => {
          const Icon = icons[label as keyof typeof icons] ?? CircleGauge;
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`group flex min-h-11 items-center gap-3 rounded-[11px] px-3 text-sm font-medium transition ${
                active
                  ? "bg-white text-[#1d1d1f]"
                  : "text-white/62 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                aria-hidden="true"
                className={`h-[18px] w-[18px] shrink-0 ${
                  active ? "text-[#0066cc]" : "text-white/48 group-hover:text-white"
                }`}
                strokeWidth={1.8}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        className="mt-auto flex min-h-11 items-center gap-3 rounded-[11px] px-3 text-sm font-medium text-white/55 transition hover:bg-white/10 hover:text-white"
      >
        <ChevronLeft className="h-[18px] w-[18px]" aria-hidden="true" />
        Lihat Website
      </Link>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-3 z-30 grid h-11 w-11 place-items-center rounded-full border border-[#e0e0e0] bg-white text-[#1d1d1f] lg:hidden"
        aria-label="Buka navigasi CMS"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <aside className="sticky top-0 hidden h-screen flex-col bg-black px-4 py-5 text-white lg:flex">
        {navigation}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup navigasi CMS"
            className="absolute inset-0 bg-black/55"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-[min(86vw,300px)] flex-col bg-black px-4 py-5 text-white">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Tutup navigasi CMS"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {navigation}
          </aside>
        </div>
      ) : null}
    </>
  );
}
