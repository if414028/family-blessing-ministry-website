import { LoginForm } from "@/components/admin/LoginForm";
import { getSiteSettings } from "@/lib/data";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata = {
  title: "Login Admin",
};

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/admin");

  const settings = await getSiteSettings();
  const logoUrl = settings.logoUrl ?? "/uploads/family-blessing-logo.png";

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] shadow-2xl md:grid-cols-[1fr_440px]">
          <section className="hidden min-h-[560px] flex-col justify-between bg-[linear-gradient(135deg,rgba(0,102,204,0.28),rgba(255,255,255,0.04))] p-10 md:flex">
            <div>
              <Image
                src={logoUrl}
                alt={`${settings.siteName} logo`}
                width={96}
                height={96}
                className="mb-9 h-24 w-24 object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.35)]"
                priority
              />
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4aa3ff]">Family Blessing CMS</p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight">Masuk untuk mengelola konten pelayanan.</h1>
            </div>
            <div className="max-w-sm text-sm leading-6 text-white/70">
              <p>{settings.siteName}</p>
              <p className="mt-2">Dashboard admin hanya untuk tim pengelola website.</p>
            </div>
          </section>
          <section className="bg-[#f5f5f7] p-6 text-[#1d1d1f] sm:p-8 md:p-10">
            <LoginForm siteName={settings.siteName} />
          </section>
        </div>
      </div>
    </div>
  );
}
