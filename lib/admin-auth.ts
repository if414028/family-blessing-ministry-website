import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function requireCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { branch: true },
  });
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireCurrentUser();
  if (user.role !== "SUPER_ADMIN") redirect("/admin");
  return user;
}

export function isSuperAdmin(user: { role: string }) {
  return user.role === "SUPER_ADMIN";
}

export function branchScopedWhere(user: { role: string; branchId: string | null }) {
  return isSuperAdmin(user) ? {} : { branchId: user.branchId ?? "__no_branch__" };
}

export function ownedBranchId(user: { role: string; branchId: string | null }, requestedBranchId?: string | null) {
  if (isSuperAdmin(user)) return requestedBranchId || null;
  return user.branchId;
}
