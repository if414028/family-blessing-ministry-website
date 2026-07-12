"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { isSuperAdmin, ownedBranchId, requireCurrentUser, requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { getYoutubeEmbedId, toSlug } from "@/lib/utils";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");
  return session;
}

const optionalString = z.string().trim().optional().transform((value) => value || null);

const branchSchema = z.object({
  name: z.string().min(2),
  slug: z.string().trim().optional(),
  type: z.enum(["ONSITE", "ZOOM"]),
  city: z.string().min(2),
  province: z.string().min(1),
  country: z.string().min(2),
  venueName: optionalString,
  address: z.string().min(3),
  contactPersonName: optionalString,
  contactPersonPhone: optionalString,
  whatsappPhone: optionalString,
  bankName: optionalString,
  bankAccountNumber: optionalString,
  bankAccountHolder: optionalString,
  youtubeChannelName: optionalString,
  youtubeUrl: optionalString,
  zoomInfo: optionalString,
  mapEmbedUrl: optionalString,
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(false),
  showContact: z.coerce.boolean().default(false),
  showBankAccount: z.coerce.boolean().default(false),
  showYoutube: z.coerce.boolean().default(false),
});

const eventSchema = z.object({
  title: z.string().min(2),
  slug: z.string().trim().optional(),
  description: z.string().min(3),
  startDate: z.string().min(1),
  endDate: optionalString,
  location: optionalString,
  branchId: optionalString,
  coverImage: optionalString,
  registrationLink: optionalString,
  isFeatured: z.coerce.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

const sermonSchema = z.object({
  title: z.string().min(2),
  slug: z.string().trim().optional(),
  speaker: z.string().min(2),
  date: z.string().min(1),
  branchId: optionalString,
  youtubeUrl: optionalString,
  description: z.string().min(3),
  thumbnail: optionalString,
  bibleVerse: optionalString,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

const albumSchema = z.object({
  title: z.string().min(2),
  slug: z.string().trim().optional(),
  description: z.string().min(3),
  coverImage: optionalString,
  branchId: optionalString,
  date: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

const settingsSchema = z.object({
  siteName: z.string().min(2),
  tagline: z.string().min(2),
  description: z.string().min(5),
  logoUrl: optionalString,
  faviconUrl: optionalString,
  primaryPhone: optionalString,
  primaryEmail: optionalString,
  instagramUrl: optionalString,
  youtubeUrl: optionalString,
  facebookUrl: optionalString,
  address: optionalString,
  seoTitle: z.string().min(2),
  seoDescription: z.string().min(5),
  ogImageUrl: optionalString,
  maintenanceMode: z.coerce.boolean().default(false),
});

const userSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "BRANCH_ADMIN"]),
  branchId: optionalString,
}).superRefine((data, context) => {
  if (data.role === "BRANCH_ADMIN" && !data.branchId) {
    context.addIssue({ code: "custom", message: "Branch Admin wajib memilih cabang.", path: ["branchId"] });
  }
});

export async function createPrayerRequest(_: unknown, formData: FormData) {
  const schema = z.object({
    name: z.string().min(2),
    whatsapp: z.string().min(6),
    email: z.string().email().optional().or(z.literal("")),
    branchId: optionalString,
    request: z.string().min(8),
    allowContact: z.coerce.boolean().default(false),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Mohon lengkapi data pokok doa dengan benar." };

  await prisma.prayerRequest.create({
    data: { ...parsed.data, email: parsed.data.email || null },
  });
  revalidatePath("/admin/prayer-requests");
  return { ok: true, message: "Terima kasih. Tim pelayanan kami akan mendoakan pokok doa Anda." };
}

export async function createContactMessage(_: unknown, formData: FormData) {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email().optional().or(z.literal("")),
    whatsapp: optionalString,
    subject: optionalString,
    message: z.string().min(8),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Mohon lengkapi pesan kontak dengan benar." };

  await prisma.contactMessage.create({
    data: { ...parsed.data, email: parsed.data.email || null },
  });
  revalidatePath("/admin/contact-messages");
  return { ok: true, message: "Terima kasih. Pesan Anda sudah kami terima." };
}

export async function saveBranch(id: string | null, formData: FormData) {
  await requireSuperAdmin();
  const parsed = branchSchema.parse(Object.fromEntries(formData));
  const slug = parsed.slug ? toSlug(parsed.slug) : toSlug(parsed.name);
  const data = { ...parsed, slug };
  if (id) await prisma.branch.update({ where: { id }, data });
  else await prisma.branch.create({ data });
  revalidatePath("/");
  revalidatePath("/cabang");
  redirect("/admin/branches");
}

export async function deleteBranch(id: string) {
  await requireSuperAdmin();
  await prisma.branch.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/admin/branches");
}

export async function saveEvent(id: string | null, formData: FormData): Promise<{ redirectTo: string }> {
  const user = await requireCurrentUser();
  const parsed = eventSchema.parse(Object.fromEntries(formData));
  const branchId = ownedBranchId(user, parsed.branchId);
  if (!isSuperAdmin(user) && !branchId) redirect("/admin/events");
  const data = {
    ...parsed,
    branchId,
    slug: parsed.slug ? toSlug(parsed.slug) : toSlug(parsed.title),
    startDate: new Date(parsed.startDate),
    endDate: parsed.endDate ? new Date(parsed.endDate) : null,
  };
  if (id) {
    const current = await prisma.event.findUnique({ where: { id }, select: { branchId: true } });
    if (!current || (!isSuperAdmin(user) && current.branchId !== user.branchId)) redirect("/admin/events");
    await prisma.event.update({ where: { id }, data });
  }
  else await prisma.event.create({ data });
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath(`/events/${data.slug}`);
  return { redirectTo: "/admin/events" };
}

export async function deleteEvent(id: string) {
  const user = await requireCurrentUser();
  const current = await prisma.event.findUnique({ where: { id }, select: { branchId: true } });
  if (!current || (!isSuperAdmin(user) && current.branchId !== user.branchId)) redirect("/admin/events");
  await prisma.event.update({ where: { id }, data: { status: "ARCHIVED" } });
  revalidatePath("/admin/events");
}

export async function saveSermon(id: string | null, formData: FormData) {
  const user = await requireCurrentUser();
  const parsed = sermonSchema.parse(Object.fromEntries(formData));
  const branchId = ownedBranchId(user, parsed.branchId);
  if (!isSuperAdmin(user) && !branchId) redirect("/admin/sermons");
  const data = {
    ...parsed,
    branchId,
    slug: parsed.slug ? toSlug(parsed.slug) : toSlug(parsed.title),
    date: new Date(parsed.date),
    youtubeEmbedId: getYoutubeEmbedId(parsed.youtubeUrl),
  };
  if (id) {
    const current = await prisma.sermon.findUnique({ where: { id }, select: { branchId: true } });
    if (!current || (!isSuperAdmin(user) && current.branchId !== user.branchId)) redirect("/admin/sermons");
    await prisma.sermon.update({ where: { id }, data });
  }
  else await prisma.sermon.create({ data });
  revalidatePath("/khotbah");
  redirect("/admin/sermons");
}

export async function deleteSermon(id: string) {
  const user = await requireCurrentUser();
  const current = await prisma.sermon.findUnique({ where: { id }, select: { branchId: true } });
  if (!current || (!isSuperAdmin(user) && current.branchId !== user.branchId)) redirect("/admin/sermons");
  await prisma.sermon.update({ where: { id }, data: { status: "ARCHIVED" } });
  revalidatePath("/admin/sermons");
}

export async function saveAlbum(id: string | null, formData: FormData) {
  const user = await requireCurrentUser();
  const parsed = albumSchema.parse(Object.fromEntries(formData));
  const branchId = ownedBranchId(user, parsed.branchId);
  if (!isSuperAdmin(user) && !branchId) redirect("/admin/gallery");
  const data = {
    ...parsed,
    branchId,
    slug: parsed.slug ? toSlug(parsed.slug) : toSlug(parsed.title),
    date: new Date(parsed.date),
  };
  if (id) {
    const current = await prisma.galleryAlbum.findUnique({ where: { id }, select: { branchId: true } });
    if (!current || (!isSuperAdmin(user) && current.branchId !== user.branchId)) redirect("/admin/gallery");
    await prisma.galleryAlbum.update({ where: { id }, data });
  }
  else await prisma.galleryAlbum.create({ data });
  revalidatePath("/gallery");
  redirect("/admin/gallery");
}

export async function deleteAlbum(id: string) {
  const user = await requireCurrentUser();
  const current = await prisma.galleryAlbum.findUnique({ where: { id }, select: { branchId: true } });
  if (!current || (!isSuperAdmin(user) && current.branchId !== user.branchId)) redirect("/admin/gallery");
  await prisma.galleryAlbum.update({ where: { id }, data: { status: "ARCHIVED" } });
  revalidatePath("/admin/gallery");
}

export async function saveSiteSettings(formData: FormData) {
  await requireSuperAdmin();
  const data = settingsSchema.parse(Object.fromEntries(formData));
  const current = await prisma.siteSetting.findFirst();
  if (current) await prisma.siteSetting.update({ where: { id: current.id }, data });
  else await prisma.siteSetting.create({ data });
  revalidatePath("/");
  redirect("/admin/site-settings");
}

export async function savePageContent(id: string | null, formData: FormData) {
  await requireSuperAdmin();
  const data = z
    .object({ slug: z.string().min(2), title: z.string().min(2), content: z.string().min(3) })
    .parse(Object.fromEntries(formData));
  if (id) await prisma.pageContent.update({ where: { id }, data: { ...data, slug: toSlug(data.slug) } });
  else await prisma.pageContent.create({ data: { ...data, slug: toSlug(data.slug) } });
  revalidatePath("/tentang-kami");
  redirect("/admin/pages");
}

export async function updatePrayerStatus(id: string, formData: FormData) {
  const user = await requireCurrentUser();
  const data = z
    .object({ status: z.enum(["NEW", "PRAYED", "CONTACTED", "ARCHIVED"]), internalNote: optionalString })
    .parse(Object.fromEntries(formData));
  const current = await prisma.prayerRequest.findUnique({ where: { id }, select: { branchId: true } });
  if (!current || (!isSuperAdmin(user) && current.branchId !== user.branchId)) redirect("/admin/prayer-requests");
  await prisma.prayerRequest.update({ where: { id }, data });
  revalidatePath("/admin/prayer-requests");
}

export async function updateContactRead(id: string, isRead: boolean) {
  await requireSuperAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin/contact-messages");
}

export async function createUser(formData: FormData) {
  await requireSuperAdmin();
  const parsed = userSchema.parse(Object.fromEntries(formData));
  await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      branchId: parsed.role === "BRANCH_ADMIN" ? parsed.branchId : null,
      passwordHash: await bcrypt.hash(parsed.password, 12),
    },
  });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateProfile(_: { ok: boolean; message: string } | undefined, formData: FormData) {
  const session = await requireAdmin();
  const userId = session.user?.id;
  if (!userId) return { ok: false, message: "Session admin tidak valid. Silakan login ulang." };

  const schema = z
    .object({
      name: z.string().trim().min(2, "Nama minimal 2 karakter."),
      email: z.string().trim().toLowerCase().email("Email tidak valid."),
      password: z.string().optional().transform((value) => value?.trim() ?? ""),
      confirmPassword: z.string().optional().transform((value) => value?.trim() ?? ""),
    })
    .superRefine((data, context) => {
      if (data.password && data.password.length < 8) {
        context.addIssue({
          code: "custom",
          message: "Password baru minimal 8 karakter.",
          path: ["password"],
        });
      }
      if (data.password !== data.confirmPassword) {
        context.addIssue({
          code: "custom",
          message: "Konfirmasi password tidak sama.",
          path: ["confirmPassword"],
        });
      }
    });

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Data profile belum valid." };

  const existing = await prisma.user.findFirst({
    where: { email: parsed.data.email, NOT: { id: userId } },
    select: { id: true },
  });
  if (existing) return { ok: false, message: "Email sudah digunakan user lain." };

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      ...(parsed.data.password ? { passwordHash: await bcrypt.hash(parsed.data.password, 12) } : {}),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/profile");
  redirect("/admin/profile?updated=1");
}
