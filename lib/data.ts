import { prisma } from "@/lib/db";
import { branchSeedData, defaultPages, defaultSiteSettings } from "@/lib/seed-data";

export type BranchLike = {
  id?: string;
  name: string;
  slug: string;
  type: "ONSITE" | "ZOOM";
  city: string;
  province: string;
  country: string;
  venueName?: string | null;
  address: string;
  contactPersonName?: string | null;
  contactPersonPhone?: string | null;
  whatsappPhone?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankAccountHolder?: string | null;
  youtubeChannelName?: string | null;
  youtubeUrl?: string | null;
  zoomInfo?: string | null;
  mapEmbedUrl?: string | null;
  showContact?: boolean;
  showBankAccount?: boolean;
  showYoutube?: boolean;
  isActive?: boolean;
  sortOrder?: number;
};

export async function getSiteSettings() {
  try {
    return (await prisma.siteSetting.findFirst()) ?? defaultSiteSettings;
  } catch {
    return defaultSiteSettings;
  }
}

export async function getPageContent(slug: string) {
  try {
    return (
      (await prisma.pageContent.findUnique({ where: { slug } })) ??
      defaultPages.find((page) => page.slug === slug)
    );
  } catch {
    return defaultPages.find((page) => page.slug === slug);
  }
}

export async function getBranches(): Promise<BranchLike[]> {
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { city: "asc" }],
    });
    return branches.length ? (branches as BranchLike[]) : [...branchSeedData];
  } catch {
    return [...branchSeedData];
  }
}

export async function getBranchBySlug(slug: string) {
  const branches = await getBranches();
  return branches.find((branch) => branch.slug === slug) ?? null;
}

export async function getPublishedEvents() {
  try {
    return await prisma.event.findMany({
      where: { status: "PUBLISHED" },
      include: { branch: true },
      orderBy: { startDate: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string) {
  try {
    return await prisma.event.findUnique({ where: { slug }, include: { branch: true } });
  } catch {
    return null;
  }
}

export async function getPublishedSermons() {
  try {
    return await prisma.sermon.findMany({
      where: { status: "PUBLISHED" },
      include: { branch: true },
      orderBy: { date: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getSermonBySlug(slug: string) {
  try {
    return await prisma.sermon.findUnique({ where: { slug }, include: { branch: true } });
  } catch {
    return null;
  }
}

export async function getPublishedAlbums() {
  try {
    return await prisma.galleryAlbum.findMany({
      where: { status: "PUBLISHED" },
      include: { branch: true, images: true },
      orderBy: { date: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getAlbumBySlug(slug: string) {
  try {
    return await prisma.galleryAlbum.findUnique({
      where: { slug },
      include: { branch: true, images: true },
    });
  } catch {
    return null;
  }
}
