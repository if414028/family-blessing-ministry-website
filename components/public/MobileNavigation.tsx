"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

type NavItem = readonly [string, string];

export function MobileNavigation({ items }: { items: readonly NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
        onClick={() => setIsOpen((open: boolean) => !open)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            className="fixed inset-0 top-[73px] z-40 bg-black/55"
            onClick={() => setIsOpen(false)}
          />
          <nav
            id="mobile-navigation"
            aria-label="Navigasi utama"
            className="absolute inset-x-3 top-[calc(100%+12px)] z-50 overflow-hidden rounded-2xl border border-white/15 bg-[#121212] p-3 shadow-2xl"
          >
            <div className="grid gap-1">
              {items.map(([label, href]: NavItem) => (
                <Link
                  key={href + label}
                  href={href}
                  className="rounded-xl px-4 py-3 text-base font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Link
              href="/admin/login"
              className="mt-3 flex items-center justify-center rounded-xl bg-[#0066cc] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0077ed]"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </nav>
        </>
      ) : null}
    </div>
  );
}
