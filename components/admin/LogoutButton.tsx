"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await signOut({ callbackUrl: "/admin/login" });
  }

  return (
    <button
      className="rounded-full border border-[#d6d6d6] px-4 py-2 text-sm font-medium text-[#1d1d1f] transition hover:border-[#0066cc] hover:text-[#0066cc] disabled:opacity-60"
      disabled={pending}
      onClick={handleLogout}
      type="button"
    >
      {pending ? "Keluar..." : "Logout"}
    </button>
  );
}
