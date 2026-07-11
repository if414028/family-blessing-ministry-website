"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  siteName = "Family Blessing",
}: {
  siteName?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password"),
    });
    setPending(false);
    if (result?.error) {
      setError("Email atau password tidak cocok.");
      return;
    }
    router.push(searchParams.get("callbackUrl") ?? "/admin");
  }

  return (
    <form action={onSubmit} className="mx-auto grid max-w-md gap-5">
      <div>
        <p className="text-sm font-semibold text-[#0066cc]">{siteName}</p>
        <h1 className="mt-2 text-3xl font-semibold">Login Admin</h1>
        <p className="mt-2 text-sm leading-6 text-[#7a7a7a]">Masukkan akun admin untuk masuk ke dashboard CMS.</p>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input className="admin-field" name="email" type="email" placeholder="admin@familyblessing.local" required />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Password
        <span className="relative">
          <input
            className="admin-field pr-12"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password admin"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#7a7a7a] transition hover:bg-[#f5f5f7] hover:text-[#0066cc]"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </span>
      </label>
      <button className="rounded-full bg-[#0066cc] px-5 py-3 text-white disabled:opacity-60" disabled={pending}>
        {pending ? "Masuk..." : "Masuk"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
