import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });
  if (!user) redirect("/admin/login");

  return (
    <div>
      <AdminPageHeader title="Edit Profile" description="Update nama, email login, atau password admin Anda." />
      <ProfileForm user={user} />
    </div>
  );
}
