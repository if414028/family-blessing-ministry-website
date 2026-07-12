import { saveAlbum, saveBranch, saveEvent, savePageContent, saveSermon, saveSiteSettings } from "@/lib/actions";
import { EventCoverImageField } from "@/components/admin/EventCoverImageField";

type AdminValue = string | number | boolean | Date | null | undefined | object;
type AdminEntity = Record<string, AdminValue> & { id?: string };
type BranchOption = { id: string; name: string };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1 text-sm font-medium">{label}{children}</label>;
}

function textValue(value: AdminValue) {
  if (value === null || value === undefined || typeof value === "object") return "";
  return String(value);
}

function numberValue(value: AdminValue, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

function booleanValue(value: AdminValue, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function dateInputValue(value: AdminValue, mode: "date" | "datetime") {
  if (!(value instanceof Date)) return "";
  return value.toISOString().slice(0, mode === "date" ? 10 : 16);
}

export function BranchForm({ branch }: { branch?: AdminEntity }) {
  const action = saveBranch.bind(null, branch?.id ?? null);
  return (
    <form action={action} className="grid gap-4 rounded-[18px] bg-white p-6 md:grid-cols-2">
      <Field label="Nama"><input className="admin-field" name="name" defaultValue={textValue(branch?.name)} required /></Field>
      <Field label="Slug"><input className="admin-field" name="slug" defaultValue={textValue(branch?.slug)} /></Field>
      <Field label="Type"><select className="admin-field" name="type" defaultValue={textValue(branch?.type) || "ONSITE"}><option>ONSITE</option><option>ZOOM</option></select></Field>
      <Field label="Kota"><input className="admin-field" name="city" defaultValue={textValue(branch?.city)} required /></Field>
      <Field label="Provinsi"><input className="admin-field" name="province" defaultValue={textValue(branch?.province)} required /></Field>
      <Field label="Negara"><input className="admin-field" name="country" defaultValue={textValue(branch?.country) || "Indonesia"} required /></Field>
      <Field label="Venue"><input className="admin-field" name="venueName" defaultValue={textValue(branch?.venueName)} /></Field>
      <Field label="Alamat"><textarea className="admin-field min-h-24" name="address" defaultValue={textValue(branch?.address)} required /></Field>
      <Field label="CP Name"><input className="admin-field" name="contactPersonName" defaultValue={textValue(branch?.contactPersonName)} /></Field>
      <Field label="CP Phone"><input className="admin-field" name="contactPersonPhone" defaultValue={textValue(branch?.contactPersonPhone)} /></Field>
      <Field label="WhatsApp"><input className="admin-field" name="whatsappPhone" defaultValue={textValue(branch?.whatsappPhone)} /></Field>
      <Field label="Bank"><input className="admin-field" name="bankName" defaultValue={textValue(branch?.bankName)} /></Field>
      <Field label="No Rekening"><input className="admin-field" name="bankAccountNumber" defaultValue={textValue(branch?.bankAccountNumber)} /></Field>
      <Field label="Atas Nama"><input className="admin-field" name="bankAccountHolder" defaultValue={textValue(branch?.bankAccountHolder)} /></Field>
      <Field label="YouTube Channel"><input className="admin-field" name="youtubeChannelName" defaultValue={textValue(branch?.youtubeChannelName)} /></Field>
      <Field label="YouTube URL"><input className="admin-field" name="youtubeUrl" defaultValue={textValue(branch?.youtubeUrl)} /></Field>
      <Field label="Zoom Info"><textarea className="admin-field" name="zoomInfo" defaultValue={textValue(branch?.zoomInfo)} /></Field>
      <Field label="Map Embed URL"><textarea className="admin-field" name="mapEmbedUrl" defaultValue={textValue(branch?.mapEmbedUrl)} /></Field>
      <Field label="Sort Order"><input className="admin-field" name="sortOrder" type="number" defaultValue={numberValue(branch?.sortOrder)} /></Field>
      <div className="flex flex-wrap gap-4 text-sm md:col-span-2">
        <label><input name="isActive" type="checkbox" value="true" defaultChecked={booleanValue(branch?.isActive, true)} /> Active</label>
        <label><input name="showContact" type="checkbox" value="true" defaultChecked={booleanValue(branch?.showContact, true)} /> Show Contact</label>
        <label><input name="showBankAccount" type="checkbox" value="true" defaultChecked={booleanValue(branch?.showBankAccount, true)} /> Show Bank</label>
        <label><input name="showYoutube" type="checkbox" value="true" defaultChecked={booleanValue(branch?.showYoutube, true)} /> Show YouTube</label>
      </div>
      <button className="rounded-full bg-[#0066cc] px-5 py-3 text-white md:col-span-2">Simpan Cabang</button>
    </form>
  );
}

export function EventForm({ event, branches }: { event?: AdminEntity; branches: BranchOption[] }) {
  const action = saveEvent.bind(null, event?.id ?? null);
  return (
    <form action={action} className="grid gap-4 rounded-[18px] bg-white p-6 md:grid-cols-2">
      <Field label="Title"><input className="admin-field" name="title" defaultValue={textValue(event?.title)} required /></Field>
      <Field label="Slug"><input className="admin-field" name="slug" defaultValue={textValue(event?.slug)} /></Field>
      <Field label="Start Date"><input className="admin-field" name="startDate" type="datetime-local" defaultValue={dateInputValue(event?.startDate, "datetime")} required /></Field>
      <Field label="End Date"><input className="admin-field" name="endDate" type="datetime-local" defaultValue={dateInputValue(event?.endDate, "datetime")} /></Field>
      <Field label="Location"><input className="admin-field" name="location" defaultValue={textValue(event?.location)} /></Field>
      <Field label="Branch"><select className="admin-field" name="branchId" defaultValue={textValue(event?.branchId)}><option value="">-</option>{branches.map((b: BranchOption) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></Field>
      <Field label="Cover Image"><EventCoverImageField initialUrl={textValue(event?.coverImage)} /></Field>
      <Field label="Registration Link"><input className="admin-field" name="registrationLink" defaultValue={textValue(event?.registrationLink)} /></Field>
      <Field label="Status"><select className="admin-field" name="status" defaultValue={textValue(event?.status) || "DRAFT"}><option>DRAFT</option><option>PUBLISHED</option><option>ARCHIVED</option></select></Field>
      <label className="mt-8 text-sm"><input name="isFeatured" type="checkbox" value="true" defaultChecked={booleanValue(event?.isFeatured)} /> Featured</label>
      <Field label="Description"><textarea className="admin-field min-h-32 md:col-span-2" name="description" defaultValue={textValue(event?.description)} required /></Field>
      <button className="rounded-full bg-[#0066cc] px-5 py-3 text-white md:col-span-2">Simpan Event</button>
    </form>
  );
}

export function SermonForm({ sermon, branches }: { sermon?: AdminEntity; branches: BranchOption[] }) {
  const action = saveSermon.bind(null, sermon?.id ?? null);
  return (
    <form action={action} className="grid gap-4 rounded-[18px] bg-white p-6 md:grid-cols-2">
      <Field label="Title"><input className="admin-field" name="title" defaultValue={textValue(sermon?.title)} required /></Field>
      <Field label="Slug"><input className="admin-field" name="slug" defaultValue={textValue(sermon?.slug)} /></Field>
      <Field label="Speaker"><input className="admin-field" name="speaker" defaultValue={textValue(sermon?.speaker)} required /></Field>
      <Field label="Date"><input className="admin-field" name="date" type="date" defaultValue={dateInputValue(sermon?.date, "date")} required /></Field>
      <Field label="Branch"><select className="admin-field" name="branchId" defaultValue={textValue(sermon?.branchId)}><option value="">-</option>{branches.map((b: BranchOption) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></Field>
      <Field label="YouTube URL"><input className="admin-field" name="youtubeUrl" defaultValue={textValue(sermon?.youtubeUrl)} /></Field>
      <Field label="Thumbnail"><input className="admin-field" name="thumbnail" defaultValue={textValue(sermon?.thumbnail)} /></Field>
      <Field label="Bible Verse"><input className="admin-field" name="bibleVerse" defaultValue={textValue(sermon?.bibleVerse)} /></Field>
      <Field label="Status"><select className="admin-field" name="status" defaultValue={textValue(sermon?.status) || "DRAFT"}><option>DRAFT</option><option>PUBLISHED</option><option>ARCHIVED</option></select></Field>
      <Field label="Description"><textarea className="admin-field min-h-32 md:col-span-2" name="description" defaultValue={textValue(sermon?.description)} required /></Field>
      <button className="rounded-full bg-[#0066cc] px-5 py-3 text-white md:col-span-2">Simpan Sermon</button>
    </form>
  );
}

export function AlbumForm({ album, branches }: { album?: AdminEntity; branches: BranchOption[] }) {
  const action = saveAlbum.bind(null, album?.id ?? null);
  return (
    <form action={action} className="grid gap-4 rounded-[18px] bg-white p-6 md:grid-cols-2">
      <Field label="Title"><input className="admin-field" name="title" defaultValue={textValue(album?.title)} required /></Field>
      <Field label="Slug"><input className="admin-field" name="slug" defaultValue={textValue(album?.slug)} /></Field>
      <Field label="Date"><input className="admin-field" name="date" type="date" defaultValue={dateInputValue(album?.date, "date")} required /></Field>
      <Field label="Branch"><select className="admin-field" name="branchId" defaultValue={textValue(album?.branchId)}><option value="">-</option>{branches.map((b: BranchOption) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></Field>
      <Field label="Cover Image"><input className="admin-field" name="coverImage" defaultValue={textValue(album?.coverImage)} /></Field>
      <Field label="Status"><select className="admin-field" name="status" defaultValue={textValue(album?.status) || "DRAFT"}><option>DRAFT</option><option>PUBLISHED</option><option>ARCHIVED</option></select></Field>
      <Field label="Description"><textarea className="admin-field min-h-32 md:col-span-2" name="description" defaultValue={textValue(album?.description)} required /></Field>
      <button className="rounded-full bg-[#0066cc] px-5 py-3 text-white md:col-span-2">Simpan Album</button>
    </form>
  );
}

export function SiteSettingsForm({ settings }: { settings: AdminEntity }) {
  return (
    <form action={saveSiteSettings} className="grid gap-4 rounded-[18px] bg-white p-6 md:grid-cols-2">
      {["siteName", "tagline", "logoUrl", "faviconUrl", "primaryPhone", "primaryEmail", "instagramUrl", "youtubeUrl", "facebookUrl", "seoTitle", "ogImageUrl"].map((name: string) => (
        <Field key={name} label={name}><input className="admin-field" name={name} defaultValue={textValue(settings?.[name])} /></Field>
      ))}
      <Field label="Description"><textarea className="admin-field min-h-28" name="description" defaultValue={textValue(settings?.description)} required /></Field>
      <Field label="Address"><textarea className="admin-field min-h-28" name="address" defaultValue={textValue(settings?.address)} /></Field>
      <Field label="SEO Description"><textarea className="admin-field min-h-28" name="seoDescription" defaultValue={textValue(settings?.seoDescription)} required /></Field>
      <label className="mt-8 text-sm"><input name="maintenanceMode" type="checkbox" value="true" defaultChecked={booleanValue(settings?.maintenanceMode)} /> Maintenance Mode</label>
      <button className="rounded-full bg-[#0066cc] px-5 py-3 text-white md:col-span-2">Simpan Settings</button>
    </form>
  );
}

export function PageContentForm({ page }: { page?: AdminEntity }) {
  const action = savePageContent.bind(null, page?.id ?? null);
  return (
    <form action={action} className="grid gap-4 rounded-[18px] bg-white p-6">
      <Field label="Slug"><input className="admin-field" name="slug" defaultValue={textValue(page?.slug)} required /></Field>
      <Field label="Title"><input className="admin-field" name="title" defaultValue={textValue(page?.title)} required /></Field>
      <Field label="Content"><textarea className="admin-field min-h-40" name="content" defaultValue={textValue(page?.content)} required /></Field>
      <button className="rounded-full bg-[#0066cc] px-5 py-3 text-white">Simpan Page</button>
    </form>
  );
}
