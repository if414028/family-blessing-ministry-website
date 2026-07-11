"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateProfile } from "@/lib/actions";

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  return (
    <form action={formAction} className="grid gap-5 rounded-[18px] bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-[#3a3a3c]">
          Nama
          <input className="admin-field" name="name" defaultValue={user.name} required />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#3a3a3c]">
          Email
          <input className="admin-field" name="email" type="email" defaultValue={user.email} required />
        </label>
      </div>

      <div className="rounded-[14px] bg-[#f5f5f7] p-4">
        <p className="font-semibold">Ubah Password</p>
        <p className="mt-1 text-sm text-[#7a7a7a]">Kosongkan bagian ini kalau tidak ingin mengganti password.</p>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#3a3a3c]">
            Password Baru
            <input className="admin-field" name="password" type="password" placeholder="Minimal 8 karakter" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#3a3a3c]">
            Konfirmasi Password
            <input className="admin-field" name="confirmPassword" type="password" placeholder="Ulangi password baru" />
          </label>
        </div>
      </div>

      {state?.message ? (
        <p className={`rounded-[12px] px-4 py-3 text-sm ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button className="rounded-full bg-[#0066cc] px-5 py-3 font-medium text-white disabled:opacity-60" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Profile"}
        </button>
        <Link className="rounded-full border border-[#d6d6d6] px-5 py-3 font-medium text-[#1d1d1f]" href="/admin/profile">
          Batal
        </Link>
      </div>
    </form>
  );
}
