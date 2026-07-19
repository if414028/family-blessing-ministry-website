import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminShell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/admin/login");

  return (
    <div>
      <AdminPageHeader
        title="Profile"
        description="Detail akun admin yang sedang login."
        action={
          <Link className="rounded-full bg-[#0066cc] px-5 py-2.5 text-white" href="/admin/profile/edit">
            Edit Profile
          </Link>
        }
      />

      <section className="admin-list overflow-hidden">
        <div className="bg-black px-6 py-8 text-white md:px-8">
          <div className="flex flex-wrap items-center gap-5">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-3xl font-semibold text-[#0066cc]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Admin Profile</p>
              <h2 className="mt-2 text-3xl font-semibold">{user.name}</h2>
              <p className="mt-1 text-white/75">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
          <ProfileInfoCard icon={<UserRound className="h-5 w-5" />} label="Nama" value={user.name} />
          <ProfileInfoCard icon={<Mail className="h-5 w-5" />} label="Email" value={user.email} />
          <ProfileInfoCard icon={<ShieldCheck className="h-5 w-5" />} label="Role" value={<StatusBadge>{formatRole(user.role)}</StatusBadge>} />
        </div>

        <div className="grid gap-4 border-t border-[#e0e0e0] p-6 text-sm md:grid-cols-2 md:p-8">
          <div>
            <p className="font-semibold text-[#1d1d1f]">Dibuat</p>
            <p className="mt-1 text-[#7a7a7a]">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <p className="font-semibold text-[#1d1d1f]">Terakhir Diupdate</p>
            <p className="mt-1 text-[#7a7a7a]">{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileInfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-[#e0e0e0] bg-[#fafafc] p-5">
      <div className="flex items-center gap-2 text-[#0066cc]">
        {icon}
        <p className="text-sm font-semibold">{label}</p>
      </div>
      <div className="mt-3 text-lg font-semibold text-[#1d1d1f]">{value}</div>
    </div>
  );
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
