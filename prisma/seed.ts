import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { branchSeedData, defaultPages, defaultSiteSettings } from "../lib/seed-data";

const adapterUrl = (process.env.DATABASE_URL ?? "").replace(/^mysql:\/\//, "mariadb://");
const adapter = new PrismaMariaDb(adapterUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.siteSetting.upsert({
    where: { id: "default-site-settings" },
    update: defaultSiteSettings,
    create: { id: "default-site-settings", ...defaultSiteSettings },
  });

  for (const [index, branch] of branchSeedData.entries()) {
    await prisma.branch.upsert({
      where: { slug: branch.slug },
      update: { ...branch, sortOrder: index, showBankAccount: Boolean(branch.bankAccountNumber), showYoutube: Boolean(branch.youtubeChannelName) },
      create: { ...branch, sortOrder: index, showBankAccount: Boolean(branch.bankAccountNumber), showYoutube: Boolean(branch.youtubeChannelName) },
    });
  }

  for (const page of defaultPages) {
    await prisma.pageContent.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@familyblessing.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-this-password";
  const adminName = process.env.ADMIN_NAME ?? "Super Admin";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { name: adminName, passwordHash, role: "SUPER_ADMIN" },
    create: { name: adminName, email: adminEmail.toLowerCase(), passwordHash, role: "SUPER_ADMIN" },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
