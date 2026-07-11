"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";

type AdminUserMenuProps = {
  user: {
    name: string;
    email: string;
    role: string;
  };
};

export function UserMenu({ user }: AdminUserMenuProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const initial = user.name.charAt(0).toUpperCase();

  async function handleLogout() {
    setPending(true);
    await signOut({ callbackUrl: "/admin/login" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-3 rounded-full px-2 py-1.5 text-left transition hover:bg-[#f5f5f7]"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2563eb] text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="hidden min-w-0 md:block">
          <span className="block max-w-44 truncate text-sm font-semibold text-[#1d1d1f]">{user.name}</span>
          <span className="block text-xs text-[#7a7a7a]">{formatRole(user.role)}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-[#7a7a7a] transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-[14px] border border-[#e0e0e0] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
          <div className="px-5 py-4">
            <p className="truncate font-semibold text-[#1d1d1f]">{user.name}</p>
            <p className="mt-1 truncate text-sm text-[#7a7a7a]">{user.email}</p>
          </div>
          <div className="border-t border-[#e0e0e0]">
            <Link
              className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-[#3a3a3c] transition hover:bg-[#f5f5f7]"
              href="/admin/profile"
              onClick={() => setOpen(false)}
            >
              <UserRound className="h-4 w-4" />
              Profile
            </Link>
          </div>
          <div className="border-t border-[#e0e0e0]">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-[#3a3a3c] transition hover:bg-[#f5f5f7] disabled:opacity-60"
              onClick={handleLogout}
              disabled={pending}
            >
              <LogOut className="h-4 w-4" />
              {pending ? "Logout..." : "Logout"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
