import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL ?? "";
const adapterUrl = databaseUrl.replace(/^mysql:\/\//, "mariadb://");
type AdapterPoolConfig = Exclude<ConstructorParameters<typeof PrismaMariaDb>[0], string>;

function databasePoolConfig(url: string): AdapterPoolConfig | string {
  if (!url) return url;

  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    // Shared hosting has a tight MySQL connection budget. Keep one small pool per Node process.
    connectionLimit: Number(process.env.DATABASE_CONNECTION_LIMIT ?? 3),
    acquireTimeout: 8_000,
    connectTimeout: 8_000,
    idleTimeout: 60,
  };
}

const adapter = new PrismaMariaDb(databasePoolConfig(adapterUrl), {
  onConnectionError(error) {
    console.error("Database connection error:", error.message);
  },
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

globalForPrisma.prisma = prisma;
