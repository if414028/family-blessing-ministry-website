"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const maxFileSize = 10 * 1024 * 1024;

export function EventCoverImageField({ initialUrl = "" }: { initialUrl?: string }) {
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Pilih file gambar berformat JPG, PNG, WebP, atau format gambar lain.");
      return;
    }

    if (file.size > maxFileSize) {
      setMessage("Ukuran gambar maksimal 10 MB.");
      return;
    }

    if (!cloudName || !uploadPreset) {
      setMessage("Upload gambar belum dikonfigurasi. Hubungi Super Admin untuk mengatur Cloudinary.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "family-blessing/events");

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { secure_url?: string; error?: { message?: string } };

      if (!response.ok || !result.secure_url) {
        throw new Error(result.error?.message ?? "Upload gambar gagal.");
      }

      setImageUrl(result.secure_url);
      setMessage("Gambar berhasil di-upload. URL akan tersimpan bersama event.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload gambar gagal. Coba lagi.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      <input name="coverImage" type="hidden" value={imageUrl} readOnly />
      <label className="grid gap-1 text-sm font-medium">
        Upload Cover Image
        <input
          className="admin-field cursor-pointer p-2"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={uploadImage}
          disabled={uploading}
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Atau URL Gambar
        <input
          className="admin-field"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="https://..."
        />
      </label>
      {imageUrl ? (
        <Image
          className="aspect-video w-full rounded-[12px] border border-[#e0e0e0] object-cover"
          src={imageUrl}
          alt="Preview cover event"
          width={800}
          height={450}
          unoptimized
        />
      ) : null}
      {message ? <p className={`text-sm ${message.startsWith("Gambar berhasil") ? "text-green-700" : "text-[#7a7a7a]"}`}>{message}</p> : null}
    </div>
  );
}
