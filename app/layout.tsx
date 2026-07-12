import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Family Blessing",
    template: "%s | Family Blessing",
  },
  description:
    "Persekutuan doa Kristen yang rindu melihat setiap keluarga mengalami pemulihan, pertumbuhan iman, dan lawatan Tuhan.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Family Blessing",
    description:
      "Persekutuan doa Kristen yang rindu melihat setiap keluarga mengalami pemulihan, pertumbuhan iman, dan lawatan Tuhan.",
    url: siteUrl,
    siteName: "Family Blessing",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
