"use client";

import Link from "next/link";
import { Copy, PlayCircle } from "lucide-react";

export function CopyButton({ value, label = "Copy" }: { value?: string | null; label?: string }) {
  if (!value) return null;
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(value)}
      className="inline-flex items-center gap-2 rounded-full border border-[#e0e0e0] px-4 py-2 text-sm"
    >
      <Copy size={14} /> {label}
    </button>
  );
}

export function WhatsAppButton({ phone, label = "WhatsApp" }: { phone?: string | null; label?: string }) {
  if (!phone) return null;
  return (
    <Link
      href={`https://wa.me/${phone.replace(/\D/g, "")}`}
      target="_blank"
      className="inline-flex rounded-full bg-[#0066cc] px-4 py-2 text-sm text-white"
    >
      {label}
    </Link>
  );
}

export function YouTubeButton({ href, label = "YouTube" }: { href?: string | null; label?: string }) {
  if (!href) return null;
  return (
    <Link
      href={href}
      target="_blank"
      className="inline-flex items-center gap-2 rounded-full border border-[#e0e0e0] px-4 py-2 text-sm"
    >
      <PlayCircle size={15} /> {label}
    </Link>
  );
}
