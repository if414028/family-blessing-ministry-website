"use client";

import { useActionState } from "react";
import { createContactMessage, createPrayerRequest } from "@/lib/actions";
import type { BranchLike } from "@/lib/data";

const initialState = { ok: false, message: "" };

export function PrayerRequestForm({ branches }: { branches: BranchLike[] }) {
  const [state, action, pending] = useActionState(createPrayerRequest, initialState);
  return (
    <form action={action} className="grid gap-4 rounded-[18px] bg-white p-6">
      <input className="form-field" name="name" placeholder="Nama" required />
      <input className="form-field" name="whatsapp" placeholder="WhatsApp" required />
      <input className="form-field" name="email" type="email" placeholder="Email (opsional)" />
      <select className="form-field" name="branchId">
        <option value="">Pilih cabang terdekat</option>
        {branches.map((branch) => (
          <option key={branch.id ?? branch.slug} value={branch.id ?? ""}>
            {branch.name}
          </option>
        ))}
      </select>
      <textarea className="form-field min-h-32" name="request" placeholder="Pokok doa" required />
      <label className="flex items-center gap-2 text-sm text-[#333333]">
        <input name="allowContact" type="checkbox" value="true" /> Saya bersedia dihubungi oleh tim pelayanan
      </label>
      <button className="rounded-full bg-[#0066cc] px-5 py-3 text-white disabled:opacity-60" disabled={pending}>
        {pending ? "Mengirim..." : "Kirim Pokok Doa"}
      </button>
      {state.message ? <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{state.message}</p> : null}
    </form>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(createContactMessage, initialState);
  return (
    <form action={action} className="grid gap-4 rounded-[18px] bg-white p-6">
      <input className="form-field" name="name" placeholder="Nama" required />
      <input className="form-field" name="email" type="email" placeholder="Email" />
      <input className="form-field" name="whatsapp" placeholder="WhatsApp" />
      <input className="form-field" name="subject" placeholder="Subjek" />
      <textarea className="form-field min-h-32" name="message" placeholder="Pesan" required />
      <button className="rounded-full bg-[#0066cc] px-5 py-3 text-white disabled:opacity-60" disabled={pending}>
        {pending ? "Mengirim..." : "Kirim Pesan"}
      </button>
      {state.message ? <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{state.message}</p> : null}
    </form>
  );
}
