"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventCoverImageField } from "@/components/admin/EventCoverImageField";
import { saveEvent } from "@/lib/actions";

type EventValue = string | boolean | Date | null | undefined;
type EventEntity = {
  id?: string;
  title?: EventValue;
  startDate?: EventValue;
  endDate?: EventValue;
  location?: EventValue;
  branchId?: EventValue;
  coverImage?: EventValue;
  registrationLink?: EventValue;
  status?: EventValue;
  isFeatured?: EventValue;
  description?: EventValue;
};
type BranchOption = { id: string; name: string };

function textValue(value: EventValue) {
  return typeof value === "string" ? value : "";
}

function dateInputValue(value: EventValue) {
  return value instanceof Date ? value.toISOString().slice(0, 16) : "";
}

export function EventForm({ event, branches }: { event?: EventEntity; branches: BranchOption[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setPending(true);
    setMessage("");

    try {
      const result = await saveEvent(event?.id ?? null, formData);
      router.replace(result.redirectTo);
      router.refresh();
    } catch {
      setMessage("Event belum tersimpan. Coba lagi atau periksa koneksi database.");
      setPending(false);
    }
  }

  return (
    <form action={submit} className="admin-form grid gap-5 md:grid-cols-2">
      <label className="grid gap-1 text-sm font-medium">Title<input className="admin-field" name="title" defaultValue={textValue(event?.title)} required /></label>
      <label className="grid gap-1 text-sm font-medium">Start Date<input className="admin-field" name="startDate" type="datetime-local" defaultValue={dateInputValue(event?.startDate)} required /></label>
      <label className="grid gap-1 text-sm font-medium">End Date<input className="admin-field" name="endDate" type="datetime-local" defaultValue={dateInputValue(event?.endDate)} /></label>
      <label className="grid gap-1 text-sm font-medium">Location<input className="admin-field" name="location" defaultValue={textValue(event?.location)} /></label>
      <label className="grid gap-1 text-sm font-medium">Branch<select className="admin-field" name="branchId" defaultValue={textValue(event?.branchId)}><option value="">-</option>{branches.map((branch: BranchOption) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-medium">Cover Image<EventCoverImageField initialUrl={textValue(event?.coverImage)} /></label>
      <label className="grid gap-1 text-sm font-medium">Registration Link<input className="admin-field" name="registrationLink" defaultValue={textValue(event?.registrationLink)} /></label>
      <label className="grid gap-1 text-sm font-medium">Status<select className="admin-field" name="status" defaultValue={textValue(event?.status) || "DRAFT"}><option>DRAFT</option><option>PUBLISHED</option><option>ARCHIVED</option></select></label>
      <label className="admin-checkbox mt-7"><input name="isFeatured" type="checkbox" value="true" defaultChecked={event?.isFeatured === true} /> Featured</label>
      <label className="grid gap-1 text-sm font-medium md:col-span-2">Description<textarea className="admin-field min-h-32" name="description" defaultValue={textValue(event?.description)} required /></label>
      {message ? <p className="text-sm text-red-700 md:col-span-2">{message}</p> : null}
      <button className="admin-primary-button md:col-span-2" disabled={pending}>{pending ? "Menyimpan..." : "Simpan Event"}</button>
    </form>
  );
}
