# Family Blessing Website + CMS

Website resmi dan CMS untuk Persekutuan Doa Kristen Family Blessing, digembalai oleh Ev. Yeremia Chemby.

## Tech Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Prisma ORM + MySQL
- NextAuth credentials auth
- bcrypt password hashing
- Zod validation
- React Hook Form dependency tersedia untuk pengembangan form CMS lanjutan
- Local upload target awal: `public/uploads`

## Setup Local dengan MAMP MySQL

1. Jalankan MAMP.
2. Pastikan MySQL berjalan.
3. Default MAMP di Mac biasanya:
   - host: `127.0.0.1`
   - port: `8889`
   - user: `root`
   - password: `root`
4. Buat database bernama `family_blessing` melalui phpMyAdmin atau MySQL client.

## Environment

Copy `.env.example` menjadi `.env`, lalu sesuaikan:

```bash
DATABASE_URL="mysql://root:root@127.0.0.1:8889/family_blessing"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_NAME="Super Admin"
ADMIN_EMAIL="admin@familyblessing.local"
ADMIN_PASSWORD="change-this-password"
AUTH_SECRET="replace-with-random-secret"
UPLOAD_DIR="public/uploads"
```

Ganti `ADMIN_PASSWORD` dan `AUTH_SECRET` sebelum production.

## Install dan Database

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Buka `http://localhost:3000`.

CMS tersedia di `http://localhost:3000/admin/login`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Deployment ke Hostinger Node.js App

1. Upload project ke Hostinger.
2. Buat database MySQL dari hPanel.
3. Set environment variables production:
   - `DATABASE_URL="mysql://DB_USER:DB_PASSWORD@DB_HOST:3306/DB_NAME"`
   - `NEXT_PUBLIC_SITE_URL="https://domain-anda.com"`
   - `ADMIN_NAME`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
   - `UPLOAD_DIR="public/uploads"`
4. Jalankan install dependency.
5. Jalankan:

```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run build
npm run start
```

Project ini tidak memakai static export. Start production menggunakan `next start`.

## Konten Seed

Seed memasukkan:

- 14 cabang Family Blessing dari brief
- site settings default
- page content default
- admin default dari env

## Troubleshooting

- `DATABASE_URL` salah: cek user, password, host, port, dan nama database.
- MySQL MAMP belum running: buka MAMP dan start MySQL.
- Port MAMP bukan `8889`: sesuaikan port di `DATABASE_URL`.
- Prisma client belum ada: jalankan `npm run db:generate`.
- Tabel belum ada: jalankan `npm run db:push`.
- Admin tidak bisa login: pastikan `npm run db:seed` sudah dijalankan dan password sesuai env saat seed.
- `AUTH_SECRET` belum diisi: isi dengan random secret yang panjang.
- Upload folder permission: pastikan `public/uploads` bisa ditulis oleh Node.js App di Hostinger.
